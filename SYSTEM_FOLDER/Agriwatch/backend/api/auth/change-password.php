<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../config/email.php';

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("Change password request received: " . $input);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit();
}

if (empty($data['email']) || empty($data['current_password']) || empty($data['new_password'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Email, current password, and new password are required"));
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid email format"));
    exit();
}

// Validate password length
if (strlen($data['new_password']) < 6) {
    http_response_code(400);
    echo json_encode(array("message" => "New password must be at least 6 characters long"));
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
    $query = "SELECT id, name, email, password, is_email_verified 
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
        echo json_encode(array("message" => "Please verify your email first before changing password"));
        exit();
    }
    
    // Verify current password
    if (!password_verify($data['current_password'], $user['password'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Current password is incorrect"));
        exit();
    }
    
    // Generate 4-digit verification code
    $verification_code = EmailHelper::generateVerificationCode();
    $verification_code_expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Store the new password temporarily and verification code
    $temp_new_password = password_hash($data['new_password'], PASSWORD_DEFAULT);
    
    // Update user with verification code and temporary new password
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
        // Send verification email with 4-digit code
        $emailSent = EmailHelper::sendVerificationEmail($user['email'], $user['name'], $verification_code);
        
        // Store the new password temporarily (in a real app, you might use a separate table)
        // For now, we'll store it in the session or use a different approach
        // This is a simplified version - in production, you might want to use a more secure approach
        
        // Set response code - 200 OK
        http_response_code(200);
        
        // Tell the user
        if ($emailSent) {
            echo json_encode(array(
                "message" => "Verification code sent to your email. Please enter the code to confirm password change.",
                "user_id" => $user['id'],
                "email_sent" => true,
                "verification_required" => true,
                "temp_password_hash" => $temp_new_password // In production, use a more secure method
            ));
        } else {
            echo json_encode(array(
                "message" => "Verification code generated, but email could not be sent. Please contact support.",
                "user_id" => $user['id'],
                "email_sent" => false,
                "verification_required" => true,
                "temp_password_hash" => $temp_new_password
            ));
        }
        
        error_log("Change password verification code sent: {$user['email']} (ID: {$user['id']}) with code: $verification_code");
        
    } else {
        // Set response code - 500 internal server error
        http_response_code(500);
        
        // Tell the user
        echo json_encode(array("message" => "Failed to generate verification code. Please try again."));
        
        error_log("Failed to generate verification code: " . json_encode($update_stmt->errorInfo()));
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Change password error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
