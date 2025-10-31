<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("Email verification request received: " . $input);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit();
}

if (empty($data['email']) || empty($data['verification_code'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Email and verification code are required"));
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid email format"));
    exit();
}

// Validate verification code format (4 digits)
if (!preg_match('/^\d{4}$/', $data['verification_code'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Verification code must be 4 digits"));
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
    
    // Find user by email and verification code
    $query = "SELECT id, name, email, verification_code, verification_code_expires, is_email_verified 
              FROM users 
              WHERE email = :email AND verification_code = :verification_code 
              LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data['email']);
    $stmt->bindParam(":verification_code", $data['verification_code']);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid email or verification code"));
        exit();
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if email is already verified
    if ($user['is_email_verified'] == 1) {
        http_response_code(400);
        echo json_encode(array("message" => "Email is already verified"));
        exit();
    }
    
    // Check if verification code has expired
    if (strtotime($user['verification_code_expires']) < time()) {
        http_response_code(400);
        echo json_encode(array("message" => "Verification code has expired. Please request a new one."));
        exit();
    }
    
    // Update user to verified status
    $update_query = "UPDATE users 
                     SET is_email_verified = 1, 
                         verification_code = NULL, 
                         verification_code_expires = NULL,
                         updated_at = NOW() 
                     WHERE id = :id";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(":id", $user['id']);
    
    if ($update_stmt->execute()) {
        // Set response code - 200 OK
        http_response_code(200);
        
        // Tell the user
        echo json_encode(array(
            "message" => "Email verified successfully! You can now log in to your account.",
            "user_id" => $user['id'],
            "email" => $user['email'],
            "name" => $user['name'],
            "verified" => true
        ));
        
        error_log("Email verified successfully: {$user['email']} (ID: {$user['id']})");
        
    } else {
        // Set response code - 500 internal server error
        http_response_code(500);
        
        // Tell the user
        echo json_encode(array("message" => "Failed to verify email. Please try again."));
        
        error_log("Failed to verify email: " . json_encode($update_stmt->errorInfo()));
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Email verification error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
