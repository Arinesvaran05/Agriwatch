<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../config/email.php';

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("Resend verification request received: " . $input);

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
    
    // Check if email is already verified
    if ($user['is_email_verified'] == 1) {
        http_response_code(400);
        echo json_encode(array("message" => "Email is already verified"));
        exit();
    }
    
    // Generate new 4-digit verification code
    $verification_code = EmailHelper::generateVerificationCode();
    $verification_code_expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Update user with new verification code
    $update_query = "UPDATE users 
                     SET verification_code = :verification_code, 
                         verification_code_expires = :verification_code_expires,
                         updated_at = NOW() 
                     WHERE id = :id";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(":verification_code", $verification_code);
    $update_stmt->bindParam(":verification_code_expires", $verification_code_expires);
    $update_stmt->bindParam(":id", $user['id']);
    
    if ($update_stmt->execute()) {
        // Send verification email with new code
        $emailSent = EmailHelper::sendVerificationEmail($user['email'], $user['name'], $verification_code);
        
        // Set response code - 200 OK
        http_response_code(200);
        
        // Tell the user
        if ($emailSent) {
            echo json_encode(array(
                "message" => "New verification code sent to your email. Please check your inbox.",
                "user_id" => $user['id'],
                "email_sent" => true
            ));
        } else {
            echo json_encode(array(
                "message" => "Verification code updated, but email could not be sent. Please contact support.",
                "user_id" => $user['id'],
                "email_sent" => false
            ));
        }
        
        error_log("Verification code resent: {$user['email']} (ID: {$user['id']}) with new code: $verification_code");
        
    } else {
        // Set response code - 500 internal server error
        http_response_code(500);
        
        // Tell the user
        echo json_encode(array("message" => "Failed to resend verification code. Please try again."));
        
        error_log("Failed to resend verification code: " . json_encode($update_stmt->errorInfo()));
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Resend verification error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
