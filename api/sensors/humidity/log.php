<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Create database connection
$database = new Database();
$db = $database->getConnection();

// Get limit parameter (default 100, max 1000)
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$limit = min($limit, 1000); // Cap at 1000 records

try {
    // Query to get humidity readings
    $query = "SELECT id, value, timestamp FROM humidity_readings ORDER BY timestamp DESC LIMIT ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $readings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return JSON response
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $readings,
        "count" => count($readings)
    ]);
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $exception->getMessage()
    ]);
}
?>
