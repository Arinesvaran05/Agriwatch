<?php
require_once 'config/cors.php';
require_once 'config/database.php';

echo "<html><head><title>Fix Admin User</title>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5;}";
echo ".container{max-width:600px;margin:0 auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}";
echo ".success{color:#27ae60;font-weight:bold;}";
echo ".error{color:#e74c3c;font-weight:bold;}";
echo ".warning{color:#f39c12;font-weight:bold;}";
echo "</style></head><body>";
echo "<div class='container'>";

echo "<h1>🔧 Fix Admin User</h1>";

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo "<p class='error'>❌ Could not connect to database</p>";
    exit();
}

echo "<p class='success'>✅ Database connected</p>";

// First, check if there's already a user with admin@agriwatch.com
$check_query = "SELECT id, name, email, role FROM users WHERE email = 'admin@agriwatch.com'";
$check_stmt = $db->prepare($check_query);
$check_stmt->execute();

if ($check_stmt->rowCount() > 0) {
    $existing_admin = $check_stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p class='warning'>⚠️ User with email admin@agriwatch.com already exists:</p>";
    echo "<ul>";
    echo "<li>ID: {$existing_admin['id']}</li>";
    echo "<li>Name: {$existing_admin['name']}</li>";
    echo "<li>Email: {$existing_admin['email']}</li>";
    echo "<li>Role: {$existing_admin['role']}</li>";
    echo "</ul>";
    
    // Update this user to be admin
    $update_query = "UPDATE users SET name = 'Admin User', role = 'admin', is_email_verified = 1 WHERE email = 'admin@agriwatch.com'";
    $update_stmt = $db->prepare($update_query);
    
    if ($update_stmt->execute()) {
        echo "<p class='success'>✅ Updated existing user to admin role</p>";
    } else {
        echo "<p class='error'>❌ Failed to update user role</p>";
    }
} else {
    echo "<p class='warning'>⚠️ No user with admin@agriwatch.com found</p>";
}

// Now update or create the admin user
$admin_password = password_hash('admin123', PASSWORD_DEFAULT);

// Try to update first (in case there's a user with different email but admin role)
$update_query = "UPDATE users SET email = 'admin@agriwatch.com', password = ?, name = 'Admin User', role = 'admin', is_email_verified = 1 WHERE role = 'admin' LIMIT 1";
$update_stmt = $db->prepare($update_query);
$update_stmt->bindParam(1, $admin_password);

if ($update_stmt->execute() && $update_stmt->rowCount() > 0) {
    echo "<p class='success'>✅ Updated existing admin user</p>";
} else {
    echo "<p class='warning'>⚠️ No existing admin user found, creating new one...</p>";
    
    // Create new admin user
    $create_query = "INSERT INTO users (name, email, password, role, is_email_verified, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    $create_stmt = $db->prepare($create_query);
    $create_stmt->bindParam(1, 'Admin User');
    $create_stmt->bindParam(2, 'admin@agriwatch.com');
    $create_stmt->bindParam(3, $admin_password);
    $create_stmt->bindParam(4, 'admin');
    $create_stmt->bindParam(5, 1);
    
    if ($create_stmt->execute()) {
        echo "<p class='success'>✅ New admin user created successfully!</p>";
    } else {
        echo "<p class='error'>❌ Failed to create admin user</p>";
    }
}

// Verify the admin user exists and show details
echo "<h3>🔍 Verifying Admin User</h3>";
$verify_query = "SELECT id, name, email, role, is_email_verified FROM users WHERE email = 'admin@agriwatch.com'";
$verify_stmt = $db->prepare($verify_query);
$verify_stmt->execute();

if ($verify_stmt->rowCount() > 0) {
    $admin_user = $verify_stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p class='success'>✅ Admin user verified:</p>";
    echo "<ul>";
    echo "<li><strong>ID:</strong> {$admin_user['id']}</li>";
    echo "<li><strong>Name:</strong> {$admin_user['name']}</li>";
    echo "<li><strong>Email:</strong> {$admin_user['email']}</li>";
    echo "<li><strong>Role:</strong> {$admin_user['role']}</li>";
    echo "<li><strong>Email Verified:</strong> " . ($admin_user['is_email_verified'] ? 'Yes' : 'No') . "</li>";
    echo "</ul>";
    
    echo "<h3>🔐 Login Credentials</h3>";
    echo "<p><strong>Email:</strong> admin@agriwatch.com</p>";
    echo "<p><strong>Password:</strong> admin123</p>";
    
    echo "<h3>✅ Ready to Login!</h3>";
    echo "<p>You can now login with:</p>";
    echo "<ul>";
    echo "<li>Email: <strong>admin@agriwatch.com</strong></li>";
    echo "<li>Password: <strong>admin123</strong></li>";
    echo "</ul>";
    
} else {
    echo "<p class='error'>❌ Admin user verification failed</p>";
}

echo "<h3>📋 Next Steps</h3>";
echo "<ol>";
echo "<li>Go back to your login page</li>";
echo "<li>Use email: <strong>admin@agriwatch.com</strong></li>";
echo "<li>Use password: <strong>admin123</strong></li>";
echo "<li>Click Login</li>";
echo "</ol>";

echo "</div></body></html>";
?>
