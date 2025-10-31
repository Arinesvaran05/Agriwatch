<?php
// Comprehensive Device Diagnostics
require_once 'api/config/database.php';
require_once 'api/config/device.php';

// Set timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

$deviceAuth = include __DIR__ . '/api/config/device.php';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgriWatch Device Diagnostics</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .pass { color: #28a745; font-weight: bold; }
        .fail { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; font-weight: bold; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .step { margin: 10px 0; padding: 10px; background: #e9ecef; border-radius: 3px; }
        .code { font-family: monospace; background: #f8f9fa; padding: 2px 4px; border-radius: 2px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 AgriWatch Device Diagnostics</h1>
        <p>This tool will help diagnose why your ESP8266 device is not sending data to the database.</p>
        
        <?php
        // Test 1: Database Connection
        echo "<div class='test-section'>";
        echo "<h2>1. Database Connection Test</h2>";
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            if ($db === null) {
                echo "<span class='fail'>❌ Database connection failed</span>";
            } else {
                echo "<span class='pass'>✅ Database connection successful</span>";
                
                // Check tables
                $tables = ['temperature_readings', 'humidity_readings', 'soil_moisture_readings'];
                foreach ($tables as $table) {
                    $stmt = $db->prepare("SHOW TABLES LIKE ?");
                    $stmt->execute([$table]);
                    if ($stmt->rowCount() > 0) {
                        echo "<br><span class='pass'>✅ Table '$table' exists</span>";
                    } else {
                        echo "<br><span class='fail'>❌ Table '$table' missing</span>";
                    }
                }
            }
        } catch (Exception $e) {
            echo "<span class='fail'>❌ Database error: " . htmlspecialchars($e->getMessage()) . "</span>";
        }
        echo "</div>";
        
        // Test 2: Device Configuration
        echo "<div class='test-section'>";
        echo "<h2>2. Device Configuration</h2>";
        $deviceId = 'ESP8266_001';
        $apiKey = $deviceAuth['devices'][$deviceId] ?? null;
        
        if ($apiKey) {
            echo "<span class='pass'>✅ Device ID '$deviceId' configured</span>";
            echo "<br><span class='info'>API Key: $apiKey</span>";
        } else {
            echo "<span class='fail'>❌ Device ID '$deviceId' not found in configuration</span>";
        }
        echo "</div>";
        
        // Test 3: Recent Data
        echo "<div class='test-section'>";
        echo "<h2>3. Recent Data Analysis</h2>";
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
                
                $count = $result['count'];
                $latest = $result['latest'];
                
                if ($count > 0) {
                    echo "<span class='pass'>✅ $sensor: $count readings in last hour</span>";
                    echo "<br><span class='info'>Latest: $latest</span><br>";
                } else {
                    echo "<span class='fail'>❌ $sensor: No readings in last hour</span><br>";
                }
            }
        } catch (Exception $e) {
            echo "<span class='fail'>❌ Data analysis failed: " . htmlspecialchars($e->getMessage()) . "</span>";
        }
        echo "</div>";
        
        // Test 4: Network Connectivity
        echo "<div class='test-section'>";
        echo "<h2>4. Network Connectivity Test</h2>";
        $serverIp = '10.49.126.170';
        $apiPath = '/agriwatch/api/device/upload.php';
        
        // Test basic connectivity
        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'method' => 'GET'
            ]
        ]);
        
        $url = "http://$serverIp$apiPath";
        echo "Testing: <span class='code'>$url</span><br>";
        
        $result = @file_get_contents($url, false, $context);
        if ($result === false) {
            echo "<span class='fail'>❌ Cannot reach server at $serverIp</span>";
        } else {
            echo "<span class='pass'>✅ Server is reachable</span>";
        }
        echo "</div>";
        
        // Test 5: API Endpoint Test
        echo "<div class='test-section'>";
        echo "<h2>5. API Endpoint Test</h2>";
        
        $testData = [
            'device_id' => $deviceId,
            'timestamp' => time(),
            'temperature' => ['value' => 25.5],
            'humidity' => ['value' => 65.2],
            'soil_moisture' => ['value' => 45.3]
        ];
        
        $jsonData = json_encode($testData);
        
        // Test with cURL
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'X-Device-Id: ' . $deviceId,
            'X-Api-Key: ' . $apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            echo "<span class='fail'>❌ cURL Error: $error</span>";
        } else {
            echo "<span class='info'>HTTP Code: $httpCode</span><br>";
            echo "<span class='info'>Response: " . htmlspecialchars($response) . "</span>";
            
            if ($httpCode == 200) {
                echo "<br><span class='pass'>✅ API endpoint is working</span>";
            } else {
                echo "<br><span class='fail'>❌ API endpoint returned error</span>";
            }
        }
        echo "</div>";
        ?>
        
        <div class="test-section">
            <h2>🔧 Troubleshooting Steps</h2>
            
            <div class="step">
                <h3>Step 1: Check ESP8266 Serial Monitor</h3>
                <p>Open Arduino IDE Serial Monitor (115200 baud) and look for:</p>
                <ul>
                    <li>WiFi connection status</li>
                    <li>HTTP response codes</li>
                    <li>Error messages</li>
                </ul>
            </div>
            
            <div class="step">
                <h3>Step 2: Verify Network Configuration</h3>
                <p>Check these settings in your ESP8266 code:</p>
                <pre>const char* WIFI_SSID = "ASHBORN";
const char* WIFI_PASSWORD = "cnfr2744";
const char* SERVER_IP = "10.49.126.170";
const char* API_PATH = "/agriwatch/api/device/upload.php";</pre>
            </div>
            
            <div class="step">
                <h3>Step 3: Test Network Connectivity</h3>
                <p>From a device on the same network, test:</p>
                <pre>ping 10.49.126.170
curl http://10.49.126.170/agriwatch/api/device/test.php</pre>
            </div>
            
            <div class="step">
                <h3>Step 4: Check Server Logs</h3>
                <p>Look at Apache/PHP error logs for incoming requests:</p>
                <pre>tail -f /var/log/apache2/error.log
tail -f /var/log/php_errors.log</pre>
            </div>
            
            <div class="step">
                <h3>Step 5: Manual API Test</h3>
                <p>Use Postman or curl to test the API:</p>
                <pre>curl -X POST http://10.49.126.170/agriwatch/api/device/upload.php \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: ESP8266_001" \
  -H "X-Api-Key: CHANGE_ME_SECURE_KEY" \
  -d '{"device_id":"ESP8266_001","temperature":{"value":25.5},"humidity":{"value":65.2},"soil_moisture":{"value":45.3}}'</pre>
            </div>
        </div>
        
        <div class="test-section">
            <h2>📋 Common Issues & Solutions</h2>
            
            <h3>Issue: "WiFi disconnected, reconnecting..."</h3>
            <p><strong>Solution:</strong> Check WiFi credentials and signal strength</p>
            
            <h3>Issue: "Connection failed" or "Failed to connect to server"</h3>
            <p><strong>Solution:</strong> Verify server IP address and network connectivity</p>
            
            <h3>Issue: "HTTP Response: 401" (Unauthorized)</h3>
            <p><strong>Solution:</strong> Check API key configuration in both device and server</p>
            
            <h3>Issue: "HTTP Response: 500" (Server Error)</h3>
            <p><strong>Solution:</strong> Check database connection and table structure</p>
            
            <h3>Issue: "DHT sensor error!"</h3>
            <p><strong>Solution:</strong> Check sensor wiring and power supply</p>
        </div>
        
        <div class="test-section">
            <h2>🔄 Next Steps</h2>
            <ol>
                <li>Run this diagnostic tool to identify the specific issue</li>
                <li>Check the ESP8266 Serial Monitor for error messages</li>
                <li>Verify network connectivity from the device's network</li>
                <li>Test the API endpoint manually</li>
                <li>Check server logs for incoming requests</li>
                <li>Update device configuration if needed</li>
            </ol>
        </div>
    </div>
</body>
</html>
