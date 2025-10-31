<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->value) && is_numeric($data->value)) {
    $database = new Database();
    $db = $database->getConnection();
    
    // Prepare query
    $query = "INSERT INTO humidity_readings (value, timestamp) VALUES (:value, NOW())";
    $stmt = $db->prepare($query);
    
    // Sanitize input
    $value = (float)$data->value;
    
    // Bind parameter
    $stmt->bindParam(":value", $value);
    
    // Execute query
    if($stmt->execute()) {
        // Set response code - 201 created
        http_response_code(201);
        
        // Tell the user
        echo json_encode(array("message" => "Humidity data recorded successfully."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode(array("message" => "Unable to record humidity data."));
    }
} else {
    // Set response code - 400 Bad request
    http_response_code(400);
    
    // Tell the user that data is incomplete
    echo json_encode(array("message" => "Unable to record humidity data. Invalid value."));
}
?>
