<?php
require_once 'config/cors.php';
require_once 'config/database.php';

// This script will check if the admin user exists and create it if needed
// WARNING: Only run this once to set up your admin account

echo "<html><head><title>AgriWatch Admin Setup</title>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5;}";
echo ".container{max-width:800px;margin:0 auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}";
echo ".success{color:#27ae60;font-weight:bold;}";
echo ".error{color:#e74c3c;font-weight:bold;}";
echo ".warning{color:#f39c12;font-weight:bold;}";
echo ".section{margin:20px 0;padding:15px;border-left:4px solid #3498db;background:#f8f9fa;}";
echo "pre{background:#2c3e50;color:#ecf0f1;padding:15px;border-radius:5px;overflow-x:auto;}";
echo "</style></head><body>";
echo "<div class='container'>";

echo "<h1>🔧 AgriWatch Admin Setup</h1>";

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo "<p class='error'>❌ ERROR: Could not connect to database</p>";
    exit();
}

echo "<p class='success'>✅ Database connection successful</p>";

// Check if admin user already exists
$check_query = "SELECT id, name, email, password, role, is_email_verified, created_at FROM users WHERE email = 'admin@agriwatch.com'";
$check_stmt = $db->prepare($check_query);
$check_stmt->execute();

if ($check_stmt->rowCount() > 0) {
    $admin_user = $check_stmt->fetch(PDO::FETCH_ASSOC);
    echo "<div class='section'>";
    echo "<h3>✅ Admin user already exists:</h3>";
    echo "<ul>";
    echo "<li><strong>ID:</strong> {$admin_user['id']}</li>";
    echo "<li><strong>Name:</strong> {$admin_user['name']}</li>";
    echo "<li><strong>Email:</strong> {$admin_user['email']}</li>";
    echo "<li><strong>Role:</strong> {$admin_user['role']}</li>";
    echo "<li><strong>Email Verified:</strong> " . ($admin_user['is_email_verified'] ? 'Yes' : 'No') . "</li>";
    echo "<li><strong>Created:</strong> {$admin_user['created_at']}</li>";
    echo "<li><strong>Password Hash:</strong> " . substr($admin_user['password'], 0, 20) . "...</li>";
    echo "</ul>";
    echo "</div>";
} else {
    echo "<div class='section'>";
    echo "<p class='warning'>⚠️ Admin user not found, creating...</p>";
    
    // Create admin user
    $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
    
    $create_query = "INSERT INTO users (name, email, password, role, is_email_verified, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    $create_stmt = $db->prepare($create_query);
    $create_stmt->bindParam(1, 'Admin User');
    $create_stmt->bindParam(2, 'admin@agriwatch.com');
    $create_stmt->bindParam(3, $admin_password);
    $create_stmt->bindParam(4, 'admin');
    $create_stmt->bindParam(5, 1);
    
    if ($create_stmt->execute()) {
        echo "<p class='success'>✅ Admin user created successfully!</p>";
        echo "<h4>Login Credentials:</h4>";
        echo "<ul>";
        echo "<li><strong>Email:</strong> admin@agriwatch.com</li>";
        echo "<li><strong>Password:</strong> admin123</li>";
        echo "</ul>";
    } else {
        echo "<p class='error'>❌ Failed to create admin user</p>";
    }
    echo "</div>";
}

// Check for duplicate emails
echo "<div class='section'>";
echo "<h3>🔍 Checking for duplicate emails</h3>";
$duplicate_query = "SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING COUNT(*) > 1";
$duplicate_stmt = $db->prepare($duplicate_query);
$duplicate_stmt->execute();
$duplicates = $duplicate_stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($duplicates)) {
    echo "<p class='success'>✅ No duplicate emails found</p>";
} else {
    echo "<p class='warning'>⚠️ Found duplicate emails:</p>";
    foreach ($duplicates as $dupe) {
        echo "<p><strong>Email:</strong> {$dupe['email']} (used by {$dupe['count']} users)</p>";
        
        // Show users with this email
        $users_query = "SELECT id, name, email, role FROM users WHERE email = ?";
        $users_stmt = $db->prepare($users_query);
        $users_stmt->bindParam(1, $dupe['email']);
        $users_stmt->execute();
        $users = $users_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<ul>";
        foreach ($users as $user) {
            echo "<li>ID: {$user['id']}, Name: {$user['name']}, Role: {$user['role']}</li>";
        }
        echo "</ul>";
    }
}
echo "</div>";

// Show all users
echo "<div class='section'>";
echo "<h3>👥 All Users in Database</h3>";
$all_users_query = "SELECT id, name, email, password, role, is_email_verified, created_at FROM users ORDER BY id";
$all_users_stmt = $db->prepare($all_users_query);
$all_users_stmt->execute();
$all_users = $all_users_stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($all_users)) {
    echo "<p>No users found in database</p>";
} else {
    echo "<table border='1' style='border-collapse:collapse;width:100%;'>";
    echo "<tr style='background:#3498db;color:white;'>";
    echo "<th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Created</th><th>Password Hash</th>";
    echo "</tr>";
    foreach ($all_users as $user) {
        echo "<tr>";
        echo "<td>{$user['id']}</td>";
        echo "<td>{$user['name']}</td>";
        echo "<td>{$user['email']}</td>";
        echo "<td>{$user['role']}</td>";
        echo "<td>" . ($user['is_email_verified'] ? 'Yes' : 'No') . "</td>";
        echo "<td>{$user['created_at']}</td>";
        echo "<td>" . substr($user['password'], 0, 20) . "...</td>";
        echo "</tr>";
    }
    echo "</table>";
}
echo "</div>";

// Test admin login
echo "<div class='section'>";
echo "<h3>🔐 Testing Admin Login</h3>";
if ($check_stmt->rowCount() > 0) {
    $admin_user = $check_stmt->fetch(PDO::FETCH_ASSOC);
    $test_password = 'admin123';
    if (password_verify($test_password, $admin_user['password'])) {
        echo "<p class='success'>✅ Password verification successful!</p>";
        echo "<p>The admin password 'admin123' is correct.</p>";
    } else {
        echo "<p class='error'>❌ Password verification failed!</p>";
        echo "<p>The password 'admin123' does not match the stored hash.</p>";
        echo "<p><strong>Stored hash:</strong> " . $admin_user['password'] . "</p>";
        
        // Try to recreate the admin user with correct password
        echo "<p class='warning'>Attempting to fix admin password...</p>";
        $new_password_hash = password_hash('admin123', PASSWORD_DEFAULT);
        $update_query = "UPDATE users SET password = ? WHERE email = 'admin@agriwatch.com'";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(1, $new_password_hash);
        
        if ($update_stmt->execute()) {
            echo "<p class='success'>✅ Admin password updated successfully!</p>";
            echo "<p>Try logging in again with admin@agriwatch.com / admin123</p>";
        } else {
            echo "<p class='error'>❌ Failed to update admin password</p>";
        }
    }
} else {
    echo "<p class='warning'>No admin user found to test</p>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h3>📋 Setup Complete</h3>";
echo "<p>If you're still having issues:</p>";
echo "<ol>";
echo "<li>Check that the database connection is working</li>";
echo "<li>Verify that the users table exists and has the correct structure</li>";
echo "<li>Make sure the password hash is being generated correctly</li>";
echo "<li>Try logging in with the credentials shown above</li>";
echo "</ol>";
echo "</div>";

echo "</div></body></html>";
?>
