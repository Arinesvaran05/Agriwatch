<?php
// Test database connection and add sample sensor data
require_once 'backend/config/database.php';

echo "<h2>AgriWatch Database Test</h2>";

// Test database connection
$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    echo "<p style='color: red;'>❌ Database connection failed!</p>";
    echo "<p>Please make sure:</p>";
    echo "<ul>";
    echo "<li>XAMPP is running</li>";
    echo "<li>MySQL service is started</li>";
    echo "<li>Database 'agriwatch' exists</li>";
    echo "</ul>";
    exit();
}

echo "<p style='color: green;'>✅ Database connection successful!</p>";

// Check if tables exist
$tables = ['users', 'temperature_readings', 'humidity_readings', 'soil_moisture_readings'];
foreach ($tables as $table) {
    $stmt = $db->prepare("SHOW TABLES LIKE ?");
    $stmt->execute([$table]);
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Table '$table' exists</p>";
    } else {
        echo "<p style='color: red;'>❌ Table '$table' does not exist</p>";
    }
}

// Check if there's any sensor data
$sensor_tables = ['temperature_readings', 'humidity_readings', 'soil_moisture_readings'];
foreach ($sensor_tables as $table) {
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
    $stmt->execute();
    $result = $stmt->fetch();
    $count = $result['count'];
    
    if ($count > 0) {
        echo "<p style='color: green;'>✅ Table '$table' has $count records</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Table '$table' has no data</p>";
        
        // Add sample data
        echo "<p>Adding sample data to '$table'...</p>";
        
        $sample_values = [];
        for ($i = 0; $i < 10; $i++) {
            if ($table === 'temperature_readings') {
                $value = rand(20, 35); // Temperature between 20-35°C
            } elseif ($table === 'humidity_readings') {
                $value = rand(40, 80); // Humidity between 40-80%
            } else { // soil_moisture_readings
                $value = rand(30, 70); // Soil moisture between 30-70%
            }
            $sample_values[] = "($value)";
        }
        
        $sql = "INSERT INTO $table (value) VALUES " . implode(', ', $sample_values);
        $stmt = $db->prepare($sql);
        if ($stmt->execute()) {
            echo "<p style='color: green;'>✅ Added 10 sample records to '$table'</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to add sample data to '$table'</p>";
        }
    }
}

// Test API endpoints
echo "<h3>Testing API Endpoints</h3>";
$api_endpoints = [
    'temperature/current.php',
    'humidity/current.php',
    'soil-moisture/current.php'
];

foreach ($api_endpoints as $endpoint) {
    $url = "http://localhost/agriwatch/backend/api/sensors/$endpoint";
    echo "<p>Testing: <a href='$url' target='_blank'>$url</a></p>";
}

echo "<h3>Next Steps</h3>";
echo "<ol>";
echo "<li>Make sure XAMPP is running</li>";
echo "<li>Import the database schema: <code>backend/database/schema.sql</code></li>";
echo "<li>Test the API endpoints above</li>";
echo "<li>Check the Angular app at: <a href='http://localhost:4200' target='_blank'>http://localhost:4200</a></li>";
echo "</ol>";
?>
