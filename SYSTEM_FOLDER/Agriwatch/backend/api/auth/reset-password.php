<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("Reset password request received: " . $input);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit();
}

if (empty($data['email']) || empty($data['reset_code']) || empty($data['new_password'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Email, reset code, and new password are required"));
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid email format"));
    exit();
}

// Validate reset code format (4 digits)
if (!preg_match('/^\d{4}$/', $data['reset_code'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Reset code must be 4 digits"));
    exit();
}

// Validate password length
if (strlen($data['new_password']) < 6) {
    http_response_code(400);
    echo json_encode(array("message" => "Password must be at least 6 characters long"));
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
    
    // Find user by email and reset code
    $query = "SELECT id, name, email, reset_code, reset_code_expires 
              FROM users 
              WHERE email = :email AND reset_code = :reset_code 
              LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data['email']);
    $stmt->bindParam(":reset_code", $data['reset_code']);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid email or reset code"));
        exit();
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if reset code has expired
    if (strtotime($user['reset_code_expires']) < time()) {
        http_response_code(400);
        echo json_encode(array("message" => "Reset code has expired. Please request a new one."));
        exit();
    }
    
    // Hash the new password
    $hashed_password = password_hash($data['new_password'], PASSWORD_DEFAULT);
    
    // Update user password and clear reset code
    $update_query = "UPDATE users 
                     SET password = :password, 
                         reset_code = NULL, 
                         reset_code_expires = NULL,
                         updated_at = NOW() 
                     WHERE id = :id";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(":password", $hashed_password);
    $update_stmt->bindParam(":id", $user['id']);
    
    if ($update_stmt->execute()) {
        // Set response code - 200 OK
        http_response_code(200);
        
        // Tell the user
        echo json_encode(array(
            "message" => "Password reset successfully! You can now log in with your new password.",
            "user_id" => $user['id'],
            "email" => $user['email'],
            "name" => $user['name'],
            "reset" => true
        ));
        
        error_log("Password reset successfully: {$user['email']} (ID: {$user['id']})");
        
    } else {
        // Set response code - 500 internal server error
        http_response_code(500);
        
        // Tell the user
        echo json_encode(array("message" => "Failed to reset password. Please try again."));
        
        error_log("Failed to reset password: " . json_encode($update_stmt->errorInfo()));
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Reset password error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
