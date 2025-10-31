<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../config/email.php';

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("Signup request received: " . $input);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit();
}

if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['confirmPassword'])) {
    http_response_code(400);
    echo json_encode(array("message" => "All fields are required"));
    exit();
}

// Check if passwords match
if ($data['password'] !== $data['confirmPassword']) {
    http_response_code(400);
    echo json_encode(array("message" => "Passwords do not match"));
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid email format"));
    exit();
}

// Validate password length
if (strlen($data['password']) < 6) {
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
    
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $data['email']);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists"));
        exit();
    }
    
    // Generate 4-digit verification code
    $verification_code = EmailHelper::generateVerificationCode();
    $verification_code_expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Hash password
    $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Prepare query
    $query = "INSERT INTO users (name, email, password, role, verification_code, verification_code_expires, is_email_verified, created_at) 
              VALUES (:name, :email, :password, :role, :verification_code, :verification_code_expires, :is_email_verified, NOW())";
    $stmt = $db->prepare($query);
    
    // Sanitize input
    $name = htmlspecialchars(strip_tags($data['name']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $role = "user"; // Default role
    $is_email_verified = 0; // Email not verified initially
    
    // Bind parameters
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":role", $role);
    $stmt->bindParam(":verification_code", $verification_code);
    $stmt->bindParam(":verification_code_expires", $verification_code_expires);
    $stmt->bindParam(":is_email_verified", $is_email_verified);
    
    // Execute query
    if ($stmt->execute()) {
        $userId = $db->lastInsertId();
        
        // Send verification email with 4-digit code
        $emailSent = EmailHelper::sendVerificationEmail($email, $name, $verification_code);
        
        // Set response code - 201 created
        http_response_code(201);
        
        // Tell the user
        if ($emailSent) {
            echo json_encode(array(
                "message" => "Account created successfully! Please check your email for the 4-digit verification code.",
                "user_id" => $userId,
                "email_sent" => true,
                "verification_required" => true
            ));
        } else {
            echo json_encode(array(
                "message" => "Account created successfully, but verification email could not be sent. Please contact support.",
                "user_id" => $userId,
                "email_sent" => false,
                "verification_required" => true
            ));
        }
        
        error_log("User created successfully: $email (ID: $userId) with verification code: $verification_code");
        
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(array("message" => "Unable to create user. Please try again later."));
        
        error_log("Failed to create user: " . json_encode($stmt->errorInfo()));
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Signup error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
