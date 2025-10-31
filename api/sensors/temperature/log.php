<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get limit parameter
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$limit = min($limit, 1000); // Maximum 1000 records

// Prepare query to get temperature readings
$query = "SELECT id, value, timestamp, 'temperature' as sensor_type 
          FROM temperature_readings 
          ORDER BY timestamp DESC 
          LIMIT :limit";

$stmt = $db->prepare($query);
$stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
$stmt->execute();

$temperature_arr = array();

if($stmt->rowCount() > 0) {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $temperature_item = array(
            "id" => $row['id'],
            "value" => (float)$row['value'],
            "timestamp" => $row['timestamp'],
            "sensor_type" => $row['sensor_type']
        );
        
        array_push($temperature_arr, $temperature_item);
    }
    
    // Set response code - 200 OK
    http_response_code(200);
    
    // Make it json format
    echo json_encode($temperature_arr);
} else {
    // Set response code - 404 Not found
    http_response_code(404);
    
    // Tell the user no temperature data found
    echo json_encode(array("message" => "No temperature data available."));
}
?>
