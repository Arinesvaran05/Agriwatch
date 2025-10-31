<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Only allow PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name']) || !isset($input['email']) || !isset($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Name, email, and user ID are required"]);
    exit();
}

$id = (int)$input['id'];
$name = trim($input['name']);
$email = trim($input['email']);

// Validate input
if (empty($name) || strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Name must be at least 2 characters long"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter a valid email address"]);
    exit();
}

// Create database connection
$database = new Database();
$db = $database->getConnection();

try {
    // Debug: Log the received data
    error_log("Profile update request - ID: $id, Name: $name, Email: $email");
    
                // First, get the current user's data
            $current_user_query = "SELECT name, email, role, is_email_verified, created_at FROM users WHERE id = ?";
    $current_user_stmt = $db->prepare($current_user_query);
    $current_user_stmt->bindParam(1, $id);
    $current_user_stmt->execute();
    
    if ($current_user_stmt->rowCount() > 0) {
        $current_user = $current_user_stmt->fetch(PDO::FETCH_ASSOC);
        
        // Debug: Log current user data
        error_log("Current user data: " . json_encode($current_user));
        
        // Check if email is being changed
        $email_changed = ($email !== $current_user['email']);
        error_log("Email changed: " . ($email_changed ? "YES" : "NO"));
        
        // Only check email uniqueness if the email is actually being changed
        if ($email_changed) {
            error_log("Email is being changed, checking uniqueness");
            
            // Check if new email is already taken by another user
            $check_query = "SELECT id FROM users WHERE email = ? AND id != ?";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->bindParam(1, $email);
            $check_stmt->bindParam(2, $id);
            $check_stmt->execute();
            
            if ($check_stmt->rowCount() > 0) {
                $conflicting_user = $check_stmt->fetch(PDO::FETCH_ASSOC);
                error_log("Email '$email' is already taken by user ID: " . $conflicting_user['id']);
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Email is already taken by another user"]);
                exit();
            } else {
                error_log("Email '$email' is available for use");
            }
        } else {
            error_log("Email not changed, skipping uniqueness check");
        }
        
        // Update the user profile
        $query = "UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $name);
        $stmt->bindParam(2, $email);
        $stmt->bindParam(3, $id);
        
        error_log("Executing update: name='$name', email='$email', id=$id");
        
        if ($stmt->execute()) {
            $affected_rows = $stmt->rowCount();
            error_log("Update successful, affected rows: $affected_rows");
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "email" => $email,
                    "role" => $current_user['role'],
                    "is_email_verified" => (bool)$current_user['is_email_verified'],
                    "created_at" => $current_user['created_at']
                ]
            ]);
        } else {
            error_log("Update failed");
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to update profile"
            ]);
        }
    } else {
        error_log("User with ID $id not found");
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
    
} catch(PDOException $exception) {
    error_log("Database error in profile update: " . $exception->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $exception->getMessage()
    ]);
}
?>
