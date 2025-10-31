<?php
// Simple database connection test
echo "<h1>🔍 Database Connection Test</h1>";

// Test 1: Basic MySQL connection
echo "<h3>Test 1: Basic MySQL Connection</h3>";
try {
    $pdo = new PDO("mysql:host=localhost", "root", "");
    echo "<p style='color: green;'>✅ Basic MySQL connection successful</p>";
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Basic MySQL connection failed: " . $e->getMessage() . "</p>";
    exit;
}

// Test 2: Check if agriwatch database exists
echo "<h3>Test 2: Check Database Exists</h3>";
try {
    $databases = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    if (in_array('agriwatch', $databases)) {
        echo "<p style='color: green;'>✅ Database 'agriwatch' exists</p>";
    } else {
        echo "<p style='color: red;'>❌ Database 'agriwatch' does NOT exist</p>";
        echo "<p>Available databases: " . implode(', ', $databases) . "</p>";
    }
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Could not check databases: " . $e->getMessage() . "</p>";
}

// Test 3: Try to connect to agriwatch database
echo "<h3>Test 3: Connect to agriwatch Database</h3>";
try {
    $pdo_agriwatch = new PDO("mysql:host=localhost;dbname=agriwatch", "root", "");
    echo "<p style='color: green;'>✅ Connection to agriwatch database successful</p>";
    
    // Test 4: Check if users table exists
    echo "<h3>Test 4: Check Users Table</h3>";
    try {
        $tables = $pdo_agriwatch->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        if (in_array('users', $tables)) {
            echo "<p style='color: green;'>✅ Users table exists</p>";
            
            // Test 5: Check users data
            echo "<h3>Test 5: Check Users Data</h3>";
            try {
                $users = $pdo_agriwatch->query("SELECT id, name, email, role, is_email_verified FROM users")->fetchAll(PDO::FETCH_ASSOC);
                echo "<p style='color: green;'>✅ Found " . count($users) . " users</p>";
                
                if (count($users) > 0) {
                    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
                    echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th></tr>";
                    foreach ($users as $user) {
                        echo "<tr>";
                        echo "<td>{$user['id']}</td>";
                        echo "<td>{$user['name']}</td>";
                        echo "<td>{$user['email']}</td>";
                        echo "<td>{$user['role']}</td>";
                        echo "<td>{$user['is_email_verified']}</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                }
                
                // Test 6: Test admin login query
                echo "<h3>Test 6: Test Admin Login Query</h3>";
                try {
                    $stmt = $pdo_agriwatch->prepare("SELECT id, name, email, password, role, is_email_verified FROM users WHERE email = ? AND role = 'admin' LIMIT 1");
                    $stmt->execute(['admin@agriwatch.com']);
                    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($admin) {
                        echo "<p style='color: green;'>✅ Admin user found: {$admin['name']} ({$admin['email']})</p>";
                        echo "<p>Password hash: " . substr($admin['password'], 0, 20) . "...</p>";
                        
                        // Test 7: Test password verification
                        echo "<h3>Test 7: Test Password Verification</h3>";
                        if (password_verify('admin123', $admin['password'])) {
                            echo "<p style='color: green;'>✅ Password 'admin123' is correct!</p>";
                        } else {
                            echo "<p style='color: red;'>❌ Password 'admin123' is incorrect!</p>";
                            echo "<p>Let's test with a new hash...</p>";
                            $new_hash = password_hash('admin123', PASSWORD_DEFAULT);
                            echo "<p>New hash for 'admin123': " . $new_hash . "</p>";
                            
                            if (password_verify('admin123', $new_hash)) {
                                echo "<p style='color: green;'>✅ New hash works correctly!</p>";
                            } else {
                                echo "<p style='color: red;'>❌ Something is wrong with password hashing!</p>";
                            }
                        }
                    } else {
                        echo "<p style='color: red;'>❌ Admin user not found!</p>";
                    }
                } catch (PDOException $e) {
                    echo "<p style='color: red;'>❌ Admin query failed: " . $e->getMessage() . "</p>";
                }
                
            } catch (PDOException $e) {
                echo "<p style='color: red;'>❌ Could not query users: " . $e->getMessage() . "</p>";
            }
        } else {
            echo "<p style='color: red;'>❌ Users table does NOT exist</p>";
            echo "<p>Available tables: " . implode(', ', $tables) . "</p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: red;'>❌ Could not check tables: " . $e->getMessage() . "</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Connection to agriwatch database failed: " . $e->getMessage() . "</p>";
}

// Test 8: Check file paths
echo "<h3>Test 8: Check File Paths</h3>";
echo "<p>Current directory: " . __DIR__ . "</p>";
echo "<p>Database config file: " . __DIR__ . "/config/database.php</p>";
echo "<p>Database config exists: " . (file_exists(__DIR__ . "/config/database.php") ? "Yes" : "No") . "</p>";

// Test 9: Check XAMPP status
echo "<h3>Test 9: Check XAMPP Services</h3>";
echo "<p>Apache status: " . (function_exists('apache_get_version') ? "Running" : "Not detected") . "</p>";
echo "<p>MySQL status: " . (extension_loaded('pdo_mysql') ? "PDO MySQL extension loaded" : "PDO MySQL extension NOT loaded") . "</p>";

echo "<h3>🔧 Next Steps</h3>";
echo "<p>If any tests failed above, here's what to do:</p>";
echo "<ol>";
echo "<li><strong>Database doesn't exist:</strong> Run reset-database.php</li>";
echo "<li><strong>Users table missing:</strong> Run reset-database.php</li>";
echo "<li><strong>No users found:</strong> Run reset-database.php</li>";
echo "<li><strong>Password verification fails:</strong> Run reset-database.php</li>";
echo "<li><strong>XAMPP not running:</strong> Start Apache and MySQL in XAMPP</li>";
echo "</ol>";

echo "<p><a href='reset-database.php' style='background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🔄 Reset Database</a></p>";
?>
