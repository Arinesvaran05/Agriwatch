<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../config/email.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->confirmPassword)) {
    // Check if passwords match
    if($data->password !== $data->confirmPassword) {
        http_response_code(400);
        echo json_encode(array("message" => "Passwords do not match."));
        exit();
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists."));
        exit();
    }
    
    // Generate verification token
    $verification_token = bin2hex(random_bytes(32));
    
    // Hash password
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    
    // Prepare query
    $query = "INSERT INTO users (name, email, password, role, verification_token, is_email_verified, created_at) 
              VALUES (:name, :email, :password, :role, :verification_token, :is_email_verified, NOW())";
    $stmt = $db->prepare($query);
    
    // Sanitize input
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));
    $role = "user"; // Default role
    $is_email_verified = 0; // Email not verified initially
    
    // Bind parameters
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":role", $role);
    $stmt->bindParam(":verification_token", $verification_token);
    $stmt->bindParam(":is_email_verified", $is_email_verified);
    
    // Execute query
    if($stmt->execute()) {
        // Send verification email
        $emailSent = EmailHelper::sendVerificationEmail($email, $name, $verification_token);
        
        // Set response code - 201 created
        http_response_code(201);
        
        // Tell the user
        if($emailSent) {
            echo json_encode(array("message" => "User was created successfully. Please check your email to verify your account."));
        } else {
            echo json_encode(array("message" => "User was created successfully, but verification email could not be sent. Please contact support."));
        }
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(array("message" => "Unable to create user."));
    }
} else {
    // Set response code - 400 Bad request
    http_response_code(400);
    
    // Tell the user that data is incomplete
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>
