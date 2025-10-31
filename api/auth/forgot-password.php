<?php
require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../config/email.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email)) {
    $database = new Database();
    $db = $database->getConnection();
    
    // Prepare query to find user with this email
    $query = "SELECT id, name FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    
    // Sanitize input
    $email = htmlspecialchars(strip_tags($data->email));
    
    // Bind parameter
    $stmt->bindParam(":email", $email);
    
    // Execute query
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Generate reset token
        $reset_token = bin2hex(random_bytes(32));
        $reset_expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Update user with reset token
        $update_query = "UPDATE users SET reset_token = :reset_token, reset_expires = :reset_expires WHERE id = :id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(":reset_token", $reset_token);
        $update_stmt->bindParam(":reset_expires", $reset_expires);
        $update_stmt->bindParam(":id", $row['id']);
        
        if($update_stmt->execute()) {
            // Send reset email
            $emailSent = EmailHelper::sendPasswordResetEmail($email, $row['name'], $reset_token);
            
            // Set response code - 200 OK
            http_response_code(200);
            
            // Tell the user
            if($emailSent) {
                echo json_encode(array("message" => "Password reset link has been sent to your email."));
            } else {
                echo json_encode(array("message" => "Password reset link could not be sent. Please try again later."));
            }
        } else {
            // Set response code - 503 service unavailable
            http_response_code(503);
            
            // Tell the user
            echo json_encode(array("message" => "Unable to process password reset request."));
        }
    } else {
        // Set response code - 404 Not found
        http_response_code(404);
        
        // Tell the user
        echo json_encode(array("message" => "Email not found."));
    }
} else {
    // Set response code - 400 Bad request
    http_response_code(400);
    
    // Tell the user that data is incomplete
    echo json_encode(array("message" => "Unable to process request. Email is missing."));
}
?>
