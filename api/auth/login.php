<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $database = new Database();
    $db = $database->getConnection();
    
    // Prepare query
    $query = "SELECT id, name, email, password, role, is_email_verified FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    
    // Sanitize input
    $email = htmlspecialchars(strip_tags($data->email));
    
    // Bind parameter
    $stmt->bindParam(":email", $email);
    
    // Execute query
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if(password_verify($data->password, $row['password'])) {
            if($row['is_email_verified'] == 1) {
                // Create response array
                $user_arr = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "role" => $row['role'],
                    "isEmailVerified" => (bool)$row['is_email_verified']
                );
                
                // Set response code - 200 OK
                http_response_code(200);
                
                // Make it json format
                echo json_encode($user_arr);
            } else {
                // Set response code - 401 Unauthorized
                http_response_code(401);
                
                // Tell the user email not verified
                echo json_encode(array("message" => "Please verify your email before logging in."));
            }
        } else {
            // Set response code - 401 Unauthorized
            http_response_code(401);
            
            // Tell the user login failed
            echo json_encode(array("message" => "Invalid email or password."));
        }
    } else {
        // Set response code - 401 Unauthorized
        http_response_code(401);
        
        // Tell the user login failed
        echo json_encode(array("message" => "Invalid email or password."));
    }
} else {
    // Set response code - 400 Bad request
    http_response_code(400);
    
    // Tell the user that data is incomplete
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}
?>
