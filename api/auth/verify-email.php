<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// Get the token from URL parameter
$token = $_GET['token'] ?? '';

if(!empty($token)) {
    $database = new Database();
    $db = $database->getConnection();
    
    // Find user with this verification token
    $query = "SELECT id, name, email FROM users WHERE verification_token = :token AND is_email_verified = 0 LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Update user to verified
        $update_query = "UPDATE users SET is_email_verified = 1, verification_token = NULL WHERE id = :id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(":id", $user['id']);
        
        if($update_stmt->execute()) {
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Email verified successfully! You can now log in to your account.",
                "user" => array(
                    "name" => $user['name'],
                    "email" => $user['email']
                )
            ));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Failed to verify email. Please try again."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Invalid or expired verification token."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Verification token is required."));
}
?>
