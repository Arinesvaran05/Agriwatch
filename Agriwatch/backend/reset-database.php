<?php
// ========================================
// AgriWatch - Complete Database Reset
// ========================================
// This script will:
// 1. Drop existing database
// 2. Create new database
// 3. Create all tables
// 4. Insert admin user
// 5. Add sample data
// ========================================

// Database connection (without database name for initial connection)
$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connect to MySQL without selecting a database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h1>🔄 AgriWatch Database Reset</h1>";
    echo "<style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .step { margin: 15px 0; padding: 15px; border-left: 4px solid #3498db; background: #f8f9fa; }
        .success { color: #27ae60; font-weight: bold; }
        .error { color: #e74c3c; font-weight: bold; }
        .warning { color: #f39c12; font-weight: bold; }
        .info { color: #3498db; font-weight: bold; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>";
    
    echo "<div class='container'>";
    
    // Step 1: Drop existing database
    echo "<div class='step'>";
    echo "<h3>📋 Step 1: Dropping Existing Database</h3>";
    try {
        $pdo->exec("DROP DATABASE IF EXISTS agriwatch");
        echo "<p class='success'>✅ Existing database 'agriwatch' dropped successfully</p>";
    } catch (PDOException $e) {
        echo "<p class='warning'>⚠️ Could not drop database: " . $e->getMessage() . "</p>";
    }
    echo "</div>";
    
    // Step 2: Create new database
    echo "<div class='step'>";
    echo "<h3>📋 Step 2: Creating New Database</h3>";
    try {
        $pdo->exec("CREATE DATABASE agriwatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "<p class='success'>✅ New database 'agriwatch' created successfully</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to create database: " . $e->getMessage() . "</p>";
        exit;
    }
    echo "</div>";
    
    // Step 3: Select the new database
    echo "<div class='step'>";
    echo "<h3>📋 Step 3: Connecting to New Database</h3>";
    try {
        $pdo->exec("USE agriwatch");
        echo "<p class='success'>✅ Connected to database 'agriwatch'</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to select database: " . $e->getMessage() . "</p>";
        exit;
    }
    echo "</div>";
    
    // Step 4: Create users table
    echo "<div class='step'>";
    echo "<h3>📋 Step 4: Creating Users Table</h3>";
    $createUsersTable = "
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    try {
        $pdo->exec($createUsersTable);
        echo "<p class='success'>✅ Users table created successfully</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to create users table: " . $e->getMessage() . "</p>";
        exit;
    }
    echo "</div>";
    
    // Step 5: Create crops table
    echo "<div class='step'>";
    echo "<h3>📋 Step 5: Creating Crops Table</h3>";
    $createCropsTable = "
    CREATE TABLE crops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        planting_season VARCHAR(100),
        harvest_time VARCHAR(100),
        water_requirements VARCHAR(100),
        soil_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    try {
        $pdo->exec($createCropsTable);
        echo "<p class='success'>✅ Crops table created successfully</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to create crops table: " . $e->getMessage() . "</p>";
    }
    echo "</div>";
    
    // Step 6: Create weather_data table
    echo "<div class='step'>";
    echo "<h3>📋 Step 6: Creating Weather Data Table</h3>";
    $createWeatherTable = "
    CREATE TABLE weather_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        temperature_high DECIMAL(5,2),
        temperature_low DECIMAL(5,2),
        humidity DECIMAL(5,2),
        rainfall DECIMAL(8,2),
        wind_speed DECIMAL(5,2),
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    try {
        $pdo->exec($createWeatherTable);
        echo "<p class='success'>✅ Weather data table created successfully</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to create weather table: " . $e->getMessage() . "</p>";
    }
    echo "</div>";
    
    // Step 7: Insert admin user
    echo "<div class='step'>";
    echo "<h3>📋 Step 7: Creating Admin User</h3>";
    $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $insertAdmin = "
    INSERT INTO users (name, email, password, role, is_email_verified) 
    VALUES ('Admin User', 'admin@agriwatch.com', :password, 'admin', 1)
    ";
    
    try {
        $stmt = $pdo->prepare($insertAdmin);
        $stmt->bindParam(':password', $adminPassword);
        $stmt->execute();
        echo "<p class='success'>✅ Admin user created successfully</p>";
        echo "<p class='info'>📧 Email: admin@agriwatch.com</p>";
        echo "<p class='info'>🔑 Password: admin123</p>";
        echo "<p class='info'>👤 Role: admin</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to create admin user: " . $e->getMessage() . "</p>";
    }
    echo "</div>";
    
    // Step 8: Insert sample user
    echo "<div class='step'>";
    echo "<h3>📋 Step 8: Creating Sample User</h3>";
    $userPassword = password_hash('user123', PASSWORD_DEFAULT);
    $insertUser = "
    INSERT INTO users (name, email, password, role, is_email_verified) 
    VALUES ('John Doe', 'user@agriwatch.com', :password, 'user', 1)
    ";
    
    try {
        $stmt = $pdo->prepare($insertUser);
        $stmt->bindParam(':password', $userPassword);
        $stmt->execute();
        echo "<p class='success'>✅ Sample user created successfully</p>";
        echo "<p class='info'>📧 Email: user@agriwatch.com</p>";
        echo "<p class='info'>🔑 Password: user123</p>";
        echo "<p class='info'>👤 Role: user</p>";
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Failed to create sample user: " . $e->getMessage() . "</p>";
    }
    echo "</div>";
    
    // Step 9: Insert sample crops
    echo "<div class='step'>";
    echo "<h3>📋 Step 9: Adding Sample Crops</h3>";
    $sampleCrops = [
        ['Rice', 'Staple food crop, requires warm climate and plenty of water', 'Spring', '3-4 months', 'High', 'Clay loam'],
        ['Wheat', 'Winter crop, drought resistant', 'Winter', '4-5 months', 'Medium', 'Loamy soil'],
        ['Corn', 'Summer crop, requires warm soil', 'Summer', '3-4 months', 'High', 'Well-drained soil'],
        ['Tomatoes', 'Warm season vegetable', 'Spring', '2-3 months', 'Medium', 'Rich loamy soil']
    ];
    
    $insertCrop = "INSERT INTO crops (name, description, planting_season, harvest_time, water_requirements, soil_type) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insertCrop);
    
    $cropsAdded = 0;
    foreach ($sampleCrops as $crop) {
        try {
            $stmt->execute($crop);
            $cropsAdded++;
        } catch (PDOException $e) {
            echo "<p class='warning'>⚠️ Failed to add crop '{$crop[0]}': " . $e->getMessage() . "</p>";
        }
    }
    
    if ($cropsAdded > 0) {
        echo "<p class='success'>✅ Added $cropsAdded sample crops</p>";
    }
    echo "</div>";
    
    // Step 10: Insert sample weather data
    echo "<div class='step'>";
    echo "<h3>📋 Step 10: Adding Sample Weather Data</h3>";
    $sampleWeather = [
        ['2024-01-15', 25.5, 18.2, 65.0, 0.0, 12.5, 'Partly cloudy'],
        ['2024-01-16', 27.8, 19.1, 70.0, 5.2, 8.3, 'Light rain'],
        ['2024-01-17', 26.3, 17.8, 68.0, 0.0, 15.2, 'Sunny']
    ];
    
    $insertWeather = "INSERT INTO weather_data (date, temperature_high, temperature_low, humidity, rainfall, wind_speed, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insertWeather);
    
    $weatherAdded = 0;
    foreach ($sampleWeather as $weather) {
        try {
            $stmt->execute($weather);
            $weatherAdded++;
        } catch (PDOException $e) {
            echo "<p class='warning'>⚠️ Failed to add weather data for '{$weather[0]}': " . $e->getMessage() . "</p>";
        }
    }
    
    if ($weatherAdded > 0) {
        echo "<p class='success'>✅ Added $weatherAdded sample weather records</p>";
    }
    echo "</div>";
    
    // Step 11: Verify database structure
    echo "<div class='step'>";
    echo "<h3>📋 Step 11: Verifying Database Structure</h3>";
    
    try {
        // Check tables
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        echo "<p class='success'>✅ Database tables: " . implode(', ', $tables) . "</p>";
        
        // Check users
        $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        echo "<p class='success'>✅ Total users: $userCount</p>";
        
        // Check admin user
        $adminCheck = $pdo->query("SELECT name, email, role FROM users WHERE email = 'admin@agriwatch.com'")->fetch(PDO::FETCH_ASSOC);
        if ($adminCheck) {
            echo "<p class='success'>✅ Admin user verified: {$adminCheck['name']} ({$adminCheck['email']}) - {$adminCheck['role']}</p>";
        }
        
        // Check sample user
        $userCheck = $pdo->query("SELECT name, email, role FROM users WHERE email = 'user@agriwatch.com'")->fetch(PDO::FETCH_ASSOC);
        if ($userCheck) {
            echo "<p class='success'>✅ Sample user verified: {$userCheck['name']} ({$userCheck['email']}) - {$userCheck['role']}</p>";
        }
        
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Verification failed: " . $e->getMessage() . "</p>";
    }
    echo "</div>";
    
    // Final summary
    echo "<div class='step'>";
    echo "<h3>🎉 Database Reset Complete!</h3>";
    echo "<p class='success'>✅ Your AgriWatch database has been completely reset and is ready to use!</p>";
    echo "<h4>🔑 Login Credentials:</h4>";
    echo "<p><strong>Admin:</strong> admin@agriwatch.com / admin123</p>";
    echo "<p><strong>User:</strong> user@agriwatch.com / user123</p>";
    echo "<h4>📱 Next Steps:</h4>";
    echo "<ol>";
    echo "<li>Try logging in with the admin credentials above</li>";
    echo "<li>Access your app at: <a href='http://localhost:4201' target='_blank'>http://localhost:4201</a></li>";
    echo "<li>Use separate login pages: <a href='http://localhost:4201/login/admin' target='_blank'>Admin</a> | <a href='http://localhost:4201/login/user' target='_blank'>User</a></li>";
    echo "</ol>";
    echo "</div>";
    
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<h1>❌ Database Connection Failed</h1>";
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
    echo "<p>Please make sure:</p>";
    echo "<ul>";
    echo "<li>XAMPP is running (Apache + MySQL)</li>";
    echo "<li>MySQL username is 'root' with no password</li>";
    echo "<li>MySQL service is accessible on localhost</li>";
    echo "</ul>";
}
?>
