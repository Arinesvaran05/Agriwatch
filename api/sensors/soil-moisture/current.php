<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Prepare query to get the latest soil moisture reading
$query = "SELECT id, value, timestamp, 'soil_moisture' as sensor_type 
          FROM soil_moisture_readings 
          ORDER BY timestamp DESC 
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Create response array
    $soil_moisture_arr = array(
        "id" => $row['id'],
        "value" => (float)$row['value'],
        "timestamp" => $row['timestamp'],
        "sensor_type" => $row['sensor_type']
    );
    
    // Set response code - 200 OK
    http_response_code(200);
    
    // Make it json format
    echo json_encode($soil_moisture_arr);
} else {
    // Set response code - 404 Not found
    http_response_code(404);
    
    // Tell the user no soil moisture data found
    echo json_encode(array("message" => "No soil moisture data available."));
}
?>
