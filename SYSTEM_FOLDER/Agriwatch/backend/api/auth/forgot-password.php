<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../config/email.php';

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("Forgot password request received: " . $input);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit();
}

if (empty($data['email'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Email is required"));
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid email format"));
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        http_response_code(500);
        echo json_encode(array("message" => "Database connection failed"));
        exit();
    }
    
    // Find user by email
    $query = "SELECT id, name, email, is_email_verified 
              FROM users 
              WHERE email = :email 
              LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data['email']);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(array("message" => "User not found"));
        exit();
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if email is verified
    if ($user['is_email_verified'] == 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Please verify your email first before requesting password reset"));
        exit();
    }
    
    // Generate 4-digit reset code
    $reset_code = EmailHelper::generateVerificationCode();
    $reset_code_expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Update user with reset code
    $update_query = "UPDATE users 
                     SET reset_code = :reset_code, 
                         reset_code_expires = :reset_code_expires,
                         updated_at = NOW() 
                     WHERE id = :id";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(":reset_code", $reset_code);
    $update_stmt->bindParam(":reset_code_expires", $reset_code_expires);
    $update_stmt->bindParam(":id", $user['id']);
    
    if ($update_stmt->execute()) {
        // Send password reset email with 4-digit code
        $emailSent = EmailHelper::sendPasswordResetEmail($user['email'], $user['name'], $reset_code);
        
        // Set response code - 200 OK
        http_response_code(200);
        
        // Tell the user
        if ($emailSent) {
            echo json_encode(array(
                "message" => "Password reset code sent to your email. Please check your inbox.",
                "user_id" => $user['id'],
                "email_sent" => true
            ));
        } else {
            echo json_encode(array(
                "message" => "Reset code generated, but email could not be sent. Please contact support.",
                "user_id" => $user['id'],
                "email_sent" => false
            ));
        }
        
        error_log("Password reset code sent: {$user['email']} (ID: {$user['id']}) with code: $reset_code");
        
    } else {
        // Set response code - 500 internal server error
        http_response_code(500);
        
        // Tell the user
        echo json_encode(array("message" => "Failed to generate reset code. Please try again."));
        
        error_log("Failed to generate reset code: " . json_encode($update_stmt->errorInfo()));
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Forgot password error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
