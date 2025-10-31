<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $database = new Database();
        $db = $database->getConnection();
        if ($db === null) {
            throw new Exception('Database connection failed');
        }

        // Latest timestamps per sensor
        $latestTemp = $db->query("SELECT timestamp, value FROM temperature_readings ORDER BY timestamp DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC) ?: null;
        $latestHum  = $db->query("SELECT timestamp, value FROM humidity_readings ORDER BY timestamp DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC) ?: null;
        $latestSoil = $db->query("SELECT timestamp, value FROM soil_moisture_readings ORDER BY timestamp DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC) ?: null;

        // Compute last_seen as the most recent among sensors
        $timestamps = [];
        foreach ([$latestTemp, $latestHum, $latestSoil] as $r) {
            if ($r && !empty($r['timestamp'])) { $timestamps[] = $r['timestamp']; }
        }
        $lastSeen = !empty($timestamps) ? max($timestamps) : null;

        // Online if last seen within threshold seconds (default 60)
        $connectionStatus = 'offline';
        $threshold = isset($_GET['threshold']) ? (int)$_GET['threshold'] : 60;
        if ($threshold <= 0) { $threshold = 60; }
        if ($lastSeen) {
            // Use PHP DateTime for more accurate time calculation
            $lastSeenTime = new DateTime($lastSeen);
            $now = new DateTime();
            $diff = $now->getTimestamp() - $lastSeenTime->getTimestamp();
            
            // Log the calculation for debugging
            error_log("Device Status Check - Last seen: $lastSeen, Now: " . $now->format('Y-m-d H:i:s') . ", Diff: $diff seconds");
            
            $connectionStatus = ($diff <= $threshold && $diff >= 0) ? 'online' : 'offline';
        }

        // Counts for quick stats (last 24h)
        $tempCount = (int)$db->query("SELECT COUNT(*) FROM temperature_readings WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();
        $humCount  = (int)$db->query("SELECT COUNT(*) FROM humidity_readings WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();
        $soilCount = (int)$db->query("SELECT COUNT(*) FROM soil_moisture_readings WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();

        // Build devices array (schema has no device_id; present a synthetic node)
        $devices = [[
            'device_id' => 'N/A',
            'name' => 'AgriWatch Node',
            'description' => 'Aggregated sensor node',
            'location' => 'Field',
            'status' => $connectionStatus,
            'connection_status' => $connectionStatus,
            'last_seen' => $lastSeen,
            'temp_readings_count' => $tempCount,
            'humidity_readings_count' => $humCount,
            'soil_readings_count' => $soilCount,
        ]];

        // Latest readings list
        $latestReadings = [];
        if ($latestTemp) { $latestReadings[] = ['sensor_type'=>'temperature','value'=>$latestTemp['value'],'timestamp'=>$latestTemp['timestamp'],'device_id'=>'N/A','unit'=>'C','location'=>'Field']; }
        if ($latestHum)  { $latestReadings[] = ['sensor_type'=>'humidity','value'=>$latestHum['value'],'timestamp'=>$latestHum['timestamp'],'device_id'=>'N/A','unit'=>'%','location'=>'Field']; }
        if ($latestSoil) { $latestReadings[] = ['sensor_type'=>'soil_moisture','value'=>$latestSoil['value'],'timestamp'=>$latestSoil['timestamp'],'device_id'=>'N/A','unit'=>'%','location'=>'Field']; }

        // Chart data last 24h (latest first)
        $tempData = $db->query("SELECT 'temperature' AS sensor_type, value, timestamp FROM temperature_readings WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY timestamp DESC")->fetchAll(PDO::FETCH_ASSOC);
        $humidityData = $db->query("SELECT 'humidity' AS sensor_type, value, timestamp FROM humidity_readings WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY timestamp DESC")->fetchAll(PDO::FETCH_ASSOC);
        $soilData = $db->query("SELECT 'soil_moisture' AS sensor_type, value, timestamp FROM soil_moisture_readings WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY timestamp DESC")->fetchAll(PDO::FETCH_ASSOC);

        // System status
        $system = [
            'api_time' => date('Y-m-d H:i:s'),
            'db_connected' => true,
            'last_seen' => $lastSeen,
            'online' => ($connectionStatus === 'online'),
            'threshold_seconds' => $threshold
        ];

        $response = [
            'status' => 'success',
            'timestamp' => date('Y-m-d H:i:s'),
            'data' => [
                'system' => $system,
                'devices' => $devices,
                'latest_readings' => $latestReadings,
                'chart_data' => [
                    'temperature' => $tempData,
                    'humidity' => $humidityData,
                    'soil_moisture' => $soilData,
                ],
                'alerts' => [],
            ],
        ];

        http_response_code(200);
        echo json_encode($response);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "status" => "error",
            "message" => "Failed to fetch device status: " . $e->getMessage()
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array(
        "status" => "error",
        "message" => "Method not allowed"
    ));
}
?>
