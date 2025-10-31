<?php
// Test Device API Endpoint
require_once 'api/config/database.php';
require_once 'api/config/device.php';

// Set timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

$deviceAuth = include __DIR__ . '/api/config/device.php';

echo "<h1>🧪 AgriWatch Device API Test</h1>\n";

// Test 1: Check database connection
echo "<h2>1. Database Connection Test</h2>\n";
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        echo "❌ Database connection failed\n";
    } else {
        echo "✅ Database connection successful\n";
        
        // Test table existence
        $tables = ['temperature_readings', 'humidity_readings', 'soil_moisture_readings'];
        foreach ($tables as $table) {
            $stmt = $db->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$table]);
            if ($stmt->rowCount() > 0) {
                echo "✅ Table '$table' exists\n";
            } else {
                echo "❌ Table '$table' missing\n";
            }
        }
    }
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

// Test 2: Check device configuration
echo "<h2>2. Device Configuration Test</h2>\n";
$deviceId = 'ESP8266_001';
$apiKey = $deviceAuth['devices'][$deviceId] ?? null;

if ($apiKey) {
    echo "✅ Device ID '$deviceId' configured\n";
    echo "✅ API Key: $apiKey\n";
} else {
    echo "❌ Device ID '$deviceId' not found in configuration\n";
}

// Test 3: Simulate device data upload
echo "<h2>3. Simulate Device Data Upload</h2>\n";

$testData = [
    'device_id' => $deviceId,
    'timestamp' => time(),
    'temperature' => ['value' => 25.5],
    'humidity' => ['value' => 65.2],
    'soil_moisture' => ['value' => 45.3]
];

$jsonData = json_encode($testData);
echo "Test data: $jsonData\n\n";

// Simulate the upload process
$_SERVER['HTTP_X_DEVICE_ID'] = $deviceId;
$_SERVER['HTTP_X_API_KEY'] = $apiKey;

// Capture output
ob_start();

// Include the upload script
try {
    // Set the input data
    $GLOBALS['test_input'] = $jsonData;
    
    // Override file_get_contents for testing
    function file_get_contents($filename) {
        if ($filename === 'php://input') {
            return $GLOBALS['test_input'];
        }
        return \file_get_contents($filename);
    }
    
    include 'api/device/upload.php';
    
    $output = ob_get_contents();
    ob_end_clean();
    
    echo "API Response:\n";
    echo "<pre>$output</pre>\n";
    
} catch (Exception $e) {
    ob_end_clean();
    echo "❌ API test failed: " . $e->getMessage() . "\n";
}

// Test 4: Check recent data
echo "<h2>4. Recent Data Check</h2>\n";
try {
    $db = $database->getConnection();
    
    $queries = [
        'temperature' => "SELECT COUNT(*) as count, MAX(timestamp) as latest FROM temperature_readings WHERE timestamp >= NOW() - INTERVAL 1 HOUR",
        'humidity' => "SELECT COUNT(*) as count, MAX(timestamp) as latest FROM humidity_readings WHERE timestamp >= NOW() - INTERVAL 1 HOUR",
        'soil_moisture' => "SELECT COUNT(*) as count, MAX(timestamp) as latest FROM soil_moisture_readings WHERE timestamp >= NOW() - INTERVAL 1 HOUR"
    ];
    
    foreach ($queries as $sensor => $query) {
        $stmt = $db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "$sensor: {$result['count']} readings in last hour, latest: {$result['latest']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Data check failed: " . $e->getMessage() . "\n";
}

// Test 5: Network connectivity test
echo "<h2>5. Network Connectivity Test</h2>\n";
$serverIp = '10.49.126.170';
$apiPath = '/agriwatch/api/device/upload.php';

// Test if server is reachable
$context = stream_context_create([
    'http' => [
        'timeout' => 5,
        'method' => 'GET'
    ]
]);

$url = "http://$serverIp$apiPath";
echo "Testing: $url\n";

$result = @file_get_contents($url, false, $context);
if ($result === false) {
    echo "❌ Cannot reach server at $serverIp\n";
    echo "This could mean:\n";
    echo "- Server is not running\n";
    echo "- Network connectivity issues\n";
    echo "- Firewall blocking access\n";
    echo "- Wrong IP address\n";
} else {
    echo "✅ Server is reachable\n";
}

echo "\n<h2>🔧 Troubleshooting Recommendations</h2>\n";
echo "<ol>\n";
echo "<li><strong>Check ESP8266 Serial Monitor:</strong> Look for connection errors, WiFi issues, or HTTP errors</li>\n";
echo "<li><strong>Verify WiFi Credentials:</strong> Ensure ESP8266 can connect to 'ASHBORN' network</li>\n";
echo "<li><strong>Test Network Connectivity:</strong> Ping 10.49.126.170 from a device on the same network</li>\n";
echo "<li><strong>Check Server Logs:</strong> Look at Apache/PHP error logs for incoming requests</li>\n";
echo "<li><strong>Verify API Key:</strong> Ensure device API key matches server configuration</li>\n";
echo "<li><strong>Test Manual Upload:</strong> Use a tool like Postman to test the API endpoint</li>\n";
echo "</ol>\n";
?>
