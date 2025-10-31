<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
// Optional: device auth
$deviceAuth = include __DIR__ . '/../config/device.php';

// Set timezone to match database timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

// Get posted data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log incoming data for debugging
error_log("AgriWatch Sensor Data Received: " . $input);

if (!$data) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid JSON data"));
    exit;
}

// device_id and timestamp are optional for current schema; we use server time
// Keep them if provided for forward-compatibility
$deviceId = isset($data['device_id']) ? $data['device_id'] : null;

// Header-based auth
$headerDeviceId = isset($_SERVER['HTTP_X_DEVICE_ID']) ? $_SERVER['HTTP_X_DEVICE_ID'] : null;
$headerApiKey   = isset($_SERVER['HTTP_X_API_KEY']) ? $_SERVER['HTTP_X_API_KEY'] : null;
if ($headerDeviceId && $deviceId === null) {
    $deviceId = $headerDeviceId;
}

if ($headerDeviceId && $headerApiKey) {
    $devices = $deviceAuth['devices'] ?? [];
    if (!isset($devices[$headerDeviceId]) || $devices[$headerDeviceId] !== $headerApiKey) {
        http_response_code(401);
        echo json_encode([ 'message' => 'Unauthorized device' ]);
        exit;
    }
}

try {
    $database = new Database();
    $db = $database->getConnection();
    if ($db === null) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Database connection failed',
        ]);
        exit;
    }
    
    // Start transaction
    $db->beginTransaction();
    
    $successCount = 0;
    $errors = array();
    
    // Process temperature data
    if (isset($data['temperature']['value'])) {
        try {
            // Current schema has no device_id column
            $query = "INSERT INTO temperature_readings (value, timestamp) VALUES (:value, NOW())";
            $stmt = $db->prepare($query);
            $tempValue = $data['temperature']['value'];
            $stmt->bindParam(":value", $tempValue);
            
            if ($stmt->execute()) {
                $successCount++;
            } else {
                $errors[] = "Failed to insert temperature data";
            }
        } catch (Exception $e) {
            $errors[] = "Temperature error: " . $e->getMessage();
        }
    }
    
    // Process humidity data
    if (isset($data['humidity']['value'])) {
        try {
            // Current schema has no device_id column
            $query = "INSERT INTO humidity_readings (value, timestamp) VALUES (:value, NOW())";
            $stmt = $db->prepare($query);
            $humValue = $data['humidity']['value'];
            $stmt->bindParam(":value", $humValue);
            
            if ($stmt->execute()) {
                $successCount++;
            } else {
                $errors[] = "Failed to insert humidity data";
            }
        } catch (Exception $e) {
            $errors[] = "Humidity error: " . $e->getMessage();
        }
    }
    
    // Process soil moisture data
    if (isset($data['soil_moisture']['value'])) {
        try {
            // Current schema has no device_id column
            $query = "INSERT INTO soil_moisture_readings (value, timestamp) VALUES (:value, NOW())";
            $stmt = $db->prepare($query);
            $soilValue = $data['soil_moisture']['value'];
            $stmt->bindParam(":value", $soilValue);
            
            if ($stmt->execute()) {
                $successCount++;
            } else {
                $errors[] = "Failed to insert soil moisture data";
            }
        } catch (Exception $e) {
            $errors[] = "Soil moisture error: " . $e->getMessage();
        }
    }
    
    // Device log table not present in schema; skip logging for now
    
    // Commit transaction if successful
    if (empty($errors)) {
        $db->commit();
        
        http_response_code(200);
        echo json_encode(array(
            "message" => "Data received successfully",
            "sensors_processed" => $successCount,
            "timestamp" => date('Y-m-d H:i:s'),
            "device_id" => $deviceId
        ));
    } else {
        // Rollback on errors
        $db->rollBack();
        
        http_response_code(500);
        echo json_encode(array(
            "message" => "Some data failed to process",
            "errors" => $errors,
            "sensors_processed" => $successCount
        ));
    }
    
} catch (Exception $e) {
    if (isset($db)) {
        $db->rollBack();
    }
    
    error_log("AgriWatch Sensor Upload Error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode(array(
        "message" => "Server error occurred",
        "error" => $e->getMessage()
    ));
}
?>
