<?php
// Test login endpoints directly
echo "<h1>🔍 Test Login Endpoints - AgriWatch</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .test { margin: 15px 0; padding: 15px; border-left: 4px solid #3498db; background: #f8f9fa; }
    .success { color: #27ae60; font-weight: bold; }
    .error { color: #e74c3c; font-weight: bold; }
    .warning { color: #f39c12; font-weight: bold; }
    pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>";

echo "<div class='container'>";

// Test 1: Check if database connection works
echo "<div class='test'>";
echo "<h3>Test 1: Database Connection</h3>";
try {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p class='success'>✅ Database connection successful</p>";
        
        // Test 2: Check if users table exists and has data
        echo "<h3>Test 2: Users Table Check</h3>";
        $stmt = $db->query("SELECT COUNT(*) as count FROM users");
        $userCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "<p class='success'>✅ Users table exists with $userCount users</p>";
        
        // Test 3: Check admin user specifically
        echo "<h3>Test 3: Admin User Check</h3>";
        $stmt = $db->prepare("SELECT id, name, email, role, is_email_verified FROM users WHERE email = ? AND role = 'admin'");
        $stmt->execute(['admin@agriwatch.com']);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin) {
            echo "<p class='success'>✅ Admin user found: {$admin['name']} ({$admin['email']})</p>";
            echo "<p>Role: {$admin['role']}, Verified: " . ($admin['is_email_verified'] ? 'Yes' : 'No') . "</p>";
            
            // Test 4: Test password verification
            echo "<h3>Test 4: Password Verification</h3>";
            $stmt = $db->prepare("SELECT password FROM users WHERE email = ?");
            $stmt->execute(['admin@agriwatch.com']);
            $passwordHash = $stmt->fetch(PDO::FETCH_ASSOC)['password'];
            
            if (password_verify('admin123', $passwordHash)) {
                echo "<p class='success'>✅ Password 'admin123' is correct!</p>";
            } else {
                echo "<p class='error'>❌ Password 'admin123' is incorrect!</p>";
                echo "<p>Current hash: " . substr($passwordHash, 0, 20) . "...</p>";
                
                // Generate new hash
                $newHash = password_hash('admin123', PASSWORD_DEFAULT);
                echo "<p>New hash for 'admin123': " . $newHash . "</p>";
                
                // Update the password
                $updateStmt = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
                if ($updateStmt->execute([$newHash, 'admin@agriwatch.com'])) {
                    echo "<p class='success'>✅ Password updated successfully!</p>";
                } else {
                    echo "<p class='error'>❌ Failed to update password</p>";
                }
            }
        } else {
            echo "<p class='error'>❌ Admin user not found!</p>";
        }
        
        // Test 5: Check all users
        echo "<h3>Test 5: All Users</h3>";
        $stmt = $db->query("SELECT id, name, email, role, is_email_verified FROM users ORDER BY role, id");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['name']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>" . ($user['is_email_verified'] ? 'Yes' : 'No') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
    } else {
        echo "<p class='error'>❌ Database connection failed</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Test 6: Test admin login endpoint directly
echo "<div class='test'>";
echo "<h3>Test 6: Test Admin Login Endpoint</h3>";
echo "<p>Testing the actual login logic...</p>";

try {
    // Simulate the login process
    $email = 'admin@agriwatch.com';
    $password = 'admin123';
    
    // Get user from database
    $stmt = $db->prepare("SELECT id, name, email, password, role, is_email_verified FROM users WHERE email = ? AND role = 'admin' LIMIT 1");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p class='success'>✅ User found in database</p>";
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            echo "<p class='success'>✅ Password verified successfully</p>";
            
            // Check email verification
            if ($user['is_email_verified'] == 1) {
                echo "<p class='success'>✅ Email is verified</p>";
                
                // Create response (same as the API would)
                $response = array(
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "isEmailVerified" => (bool)$user['is_email_verified'],
                    "loginType" => "admin"
                );
                
                echo "<p class='success'>✅ Login would be successful!</p>";
                echo "<p>Response: " . json_encode($response, JSON_PRETTY_PRINT) . "</p>";
                
            } else {
                echo "<p class='error'>❌ Email not verified</p>";
            }
        } else {
            echo "<p class='error'>❌ Password verification failed</p>";
        }
    } else {
        echo "<p class='error'>❌ User not found</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Login test failed: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Test 7: Check file paths
echo "<div class='test'>";
echo "<h3>Test 7: File Paths Check</h3>";
echo "<p>Current directory: " . __DIR__ . "</p>";
echo "<p>Database config: " . (file_exists(__DIR__ . "/config/database.php") ? "✅ Exists" : "❌ Missing") . "</p>";
echo "<p>Admin login: " . (file_exists(__DIR__ . "/auth/admin-login.php") ? "✅ Exists" : "❌ Missing") . "</p>";
echo "<p>User login: " . (file_exists(__DIR__ . "/auth/user-login.php") ? "✅ Exists" : "❌ Missing") . "</p>";
echo "</div>";

echo "<h3>🔧 Next Steps</h3>";
echo "<p>If the database tests pass but login still doesn't work:</p>";
echo "<ol>";
echo "<li>Check if Angular app is running on port 4201</li>";
echo "<li>Check browser console for JavaScript errors</li>";
echo "<li>Check if API endpoints are accessible</li>";
echo "<li>Try the test-login.html file</li>";
echo "</ol>";

echo "<p><a href='test-login.html' style='background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🧪 Test Login HTML</a></p>";

echo "</div>";
?>
