<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Set timeout for the script
set_time_limit(30);

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log the request for debugging
error_log("Login request received: " . $input);

// Validate input data
if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit();
}

if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Email and password are required"));
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
    
    // Prepare query
    $query = "SELECT id, name, email, password, role, is_email_verified, created_at FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    
    // Sanitize input
    $email = htmlspecialchars(strip_tags($data['email']));
    
    // Bind parameter
    $stmt->bindParam(":email", $email);
    
    // Execute query with timeout
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (password_verify($data['password'], $row['password'])) {
            if ($row['is_email_verified'] == 1) {
                // Create response array
                $user_arr = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "role" => $row['role'],
                    "is_email_verified" => (bool)$row['is_email_verified'],
                    "created_at" => $row['created_at']
                );
                
                // Set response code - 200 OK
                http_response_code(200);
                
                // Make it json format
                echo json_encode($user_arr);
                
                error_log("Login successful: {$row['email']} (ID: {$row['id']})");
                
            } else {
                // Set response code - 401 Unauthorized
                http_response_code(401);
                
                // Tell the user email not verified
                echo json_encode(array("message" => "Please verify your email before logging in."));
                
                error_log("Login failed - email not verified: {$row['email']}");
            }
        } else {
            // Set response code - 401 Unauthorized
            http_response_code(401);
            
            // Tell the user login failed
            echo json_encode(array("message" => "Invalid email or password."));
            
            error_log("Login failed - invalid password: {$data['email']}");
        }
    } else {
        // Set response code - 401 Unauthorized
        http_response_code(401);
        
        // Tell the user login failed
        echo json_encode(array("message" => "Invalid email or password."));
        
        error_log("Login failed - user not found: {$data['email']}");
    }
    
} catch (Exception $e) {
    // Set response code - 500 internal server error
    http_response_code(500);
    
    // Tell the user
    echo json_encode(array("message" => "An error occurred. Please try again later."));
    
    // Log the error for debugging
    error_log("Login error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
}
?>
