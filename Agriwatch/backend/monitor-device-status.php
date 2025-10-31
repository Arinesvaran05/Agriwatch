<?php
// Device Status Monitor
require_once 'api/config/database.php';
require_once 'api/config/device.php';

// Set timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

$deviceAuth = include __DIR__ . '/api/config/device.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        die("Database connection failed");
    }
    
    // Get latest readings from each sensor
    $queries = [
        'temperature' => "SELECT value, timestamp FROM temperature_readings ORDER BY timestamp DESC LIMIT 1",
        'humidity' => "SELECT value, timestamp FROM humidity_readings ORDER BY timestamp DESC LIMIT 1", 
        'soil_moisture' => "SELECT value, timestamp FROM soil_moisture_readings ORDER BY timestamp DESC LIMIT 1"
    ];
    
    $latestReadings = [];
    foreach ($queries as $sensor => $query) {
        $stmt = $db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $latestReadings[$sensor] = $result;
    }
    
    // Get count of readings in last hour
    $hourlyQueries = [
        'temperature' => "SELECT COUNT(*) as count FROM temperature_readings WHERE timestamp >= NOW() - INTERVAL 1 HOUR",
        'humidity' => "SELECT COUNT(*) as count FROM humidity_readings WHERE timestamp >= NOW() - INTERVAL 1 HOUR",
        'soil_moisture' => "SELECT COUNT(*) as count FROM soil_moisture_readings WHERE timestamp >= NOW() - INTERVAL 1 HOUR"
    ];
    
    $hourlyCounts = [];
    foreach ($hourlyQueries as $sensor => $query) {
        $stmt = $db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $hourlyCounts[$sensor] = $result['count'];
    }
    
} catch (Exception $e) {
    $error = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgriWatch Device Status Monitor</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .status-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        .status-card h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .status-item:last-child {
            border-bottom: none;
        }
        .status-label {
            font-weight: bold;
            color: #666;
        }
        .status-value {
            color: #333;
        }
        .status-good {
            color: #28a745;
            font-weight: bold;
        }
        .status-warning {
            color: #ffc107;
            font-weight: bold;
        }
        .status-error {
            color: #dc3545;
            font-weight: bold;
        }
        .config-section {
            background: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .config-section h3 {
            margin-top: 0;
            color: #495057;
        }
        .config-item {
            margin: 10px 0;
            font-family: monospace;
            background: white;
            padding: 10px;
            border-radius: 4px;
        }
        .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px 0;
        }
        .refresh-btn:hover {
            background: #0056b3;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 AgriWatch Device Status Monitor</h1>
        
        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Status</button>
        
        <?php if (isset($error)): ?>
            <div class="error">
                <strong>Error:</strong> <?php echo htmlspecialchars($error); ?>
            </div>
        <?php else: ?>
            <div class="status-grid">
                <!-- Temperature Status -->
                <div class="status-card">
                    <h3>🌡️ Temperature Sensor</h3>
                    <div class="status-item">
                        <span class="status-label">Latest Reading:</span>
                        <span class="status-value">
                            <?php 
                            if ($latestReadings['temperature']) {
                                echo $latestReadings['temperature']['value'] . '°C';
                            } else {
                                echo '<span class="status-error">No data</span>';
                            }
                            ?>
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Last Update:</span>
                        <span class="status-value">
                            <?php 
                            if ($latestReadings['temperature']) {
                                $time = new DateTime($latestReadings['temperature']['timestamp']);
                                echo $time->format('Y-m-d H:i:s');
                            } else {
                                echo '<span class="status-error">Never</span>';
                            }
                            ?>
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Readings (Last Hour):</span>
                        <span class="status-value <?php echo $hourlyCounts['temperature'] > 0 ? 'status-good' : 'status-error'; ?>">
                            <?php echo $hourlyCounts['temperature']; ?>
                        </span>
                    </div>
                </div>
                
                <!-- Humidity Status -->
                <div class="status-card">
                    <h3>💧 Humidity Sensor</h3>
                    <div class="status-item">
                        <span class="status-label">Latest Reading:</span>
                        <span class="status-value">
                            <?php 
                            if ($latestReadings['humidity']) {
                                echo $latestReadings['humidity']['value'] . '%';
                            } else {
                                echo '<span class="status-error">No data</span>';
                            }
                            ?>
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Last Update:</span>
                        <span class="status-value">
                            <?php 
                            if ($latestReadings['humidity']) {
                                $time = new DateTime($latestReadings['humidity']['timestamp']);
                                echo $time->format('Y-m-d H:i:s');
                            } else {
                                echo '<span class="status-error">Never</span>';
                            }
                            ?>
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Readings (Last Hour):</span>
                        <span class="status-value <?php echo $hourlyCounts['humidity'] > 0 ? 'status-good' : 'status-error'; ?>">
                            <?php echo $hourlyCounts['humidity']; ?>
                        </span>
                    </div>
                </div>
                
                <!-- Soil Moisture Status -->
                <div class="status-card">
                    <h3>🌱 Soil Moisture Sensor</h3>
                    <div class="status-item">
                        <span class="status-label">Latest Reading:</span>
                        <span class="status-value">
                            <?php 
                            if ($latestReadings['soil_moisture']) {
                                echo $latestReadings['soil_moisture']['value'] . '%';
                            } else {
                                echo '<span class="status-error">No data</span>';
                            }
                            ?>
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Last Update:</span>
                        <span class="status-value">
                            <?php 
                            if ($latestReadings['soil_moisture']) {
                                $time = new DateTime($latestReadings['soil_moisture']['timestamp']);
                                echo $time->format('Y-m-d H:i:s');
                            } else {
                                echo '<span class="status-error">Never</span>';
                            }
                            ?>
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Readings (Last Hour):</span>
                        <span class="status-value <?php echo $hourlyCounts['soil_moisture'] > 0 ? 'status-good' : 'status-error'; ?>">
                            <?php echo $hourlyCounts['soil_moisture']; ?>
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Device Configuration -->
            <div class="config-section">
                <h3>📋 Device Configuration</h3>
                <div class="config-item">
                    <strong>Device ID:</strong> ESP8266_001
                </div>
                <div class="config-item">
                    <strong>API Key:</strong> <?php echo $deviceAuth['devices']['ESP8266_001']; ?>
                </div>
                <div class="config-item">
                    <strong>Server IP:</strong> 10.176.225.170
                </div>
                <div class="config-item">
                    <strong>API Endpoint:</strong> /agriwatch/api/device/upload.php
                </div>
                <div class="config-item">
                    <strong>Send Interval:</strong> 30 seconds
                </div>
            </div>
            
            <!-- Troubleshooting -->
            <div class="config-section">
                <h3>🔧 Troubleshooting Steps</h3>
                <ol>
                    <li><strong>Check WiFi Connection:</strong> Ensure ESP8266 is connected to "ASHBORN" network</li>
                    <li><strong>Verify Server IP:</strong> Confirm 10.176.225.170 is accessible from device network</li>
                    <li><strong>Check API Endpoint:</strong> Test <code>http://10.176.225.170/agriwatch/api/device/upload.php</code></li>
                    <li><strong>Monitor Serial Output:</strong> Check ESP8266 serial monitor for error messages</li>
                    <li><strong>Verify Database:</strong> Ensure database tables exist and are accessible</li>
                    <li><strong>Check API Key:</strong> Confirm device API key matches server configuration</li>
                </ol>
            </div>
        <?php endif; ?>
    </div>
    
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(function() {
            location.reload();
        }, 30000);
    </script>
</body>
</html>