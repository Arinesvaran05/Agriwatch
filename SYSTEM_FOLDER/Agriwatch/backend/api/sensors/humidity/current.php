<?php
require_once '../../../config/cors.php';
require_once '../../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Prepare query to get the latest humidity reading
$query = "SELECT id, value, timestamp, 'humidity' as sensor_type 
          FROM humidity_readings 
          ORDER BY timestamp DESC 
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Create response array
    $humidity_arr = array(
        "id" => $row['id'],
        "value" => (float)$row['value'],
        "timestamp" => $row['timestamp'],
        "sensor_type" => $row['sensor_type']
    );
    
    // Set response code - 200 OK
    http_response_code(200);
    
    // Make it json format
    echo json_encode($humidity_arr);
} else {
    // Set response code - 404 Not found
    http_response_code(404);
    
    // Tell the user no humidity data found
    echo json_encode(array("message" => "No humidity data available."));
}
?>
