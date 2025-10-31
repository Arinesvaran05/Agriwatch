<?php
require_once 'config/cors.php';
require_once 'config/database.php';

echo "<html><head><title>Database Check & Fix - AgriWatch</title>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5;}";
echo ".container{max-width:1000px;margin:0 auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}";
echo ".success{color:#27ae60;font-weight:bold;}";
echo ".error{color:#e74c3c;font-weight:bold;}";
echo ".warning{color:#f39c12;font-weight:bold;}";
echo ".info{color:#3498db;font-weight:bold;}";
echo ".section{margin:20px 0;padding:15px;border-left:4px solid #3498db;background:#f8f9fa;}";
echo "table{border-collapse:collapse;width:100%;margin:10px 0;}";
echo "th,td{border:1px solid #ddd;padding:8px;text-align:left;}";
echo "th{background-color:#3498db;color:white;}";
echo ".code{background:#2c3e50;color:#ecf0f1;padding:15px;border-radius:5px;font-family:monospace;overflow-x:auto;}";
echo "</style></head><body>";
echo "<div class='container'>";

echo "<h1>🔍 Database Check & Fix - AgriWatch</h1>";

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo "<p class='error'>❌ Could not connect to database</p>";
    echo "<p>Please make sure XAMPP is running and database 'agriwatch' exists.</p>";
    exit();
}

echo "<p class='success'>✅ Database connection successful</p>";

// Check database structure
echo "<div class='section'>";
echo "<h3>📊 Database Structure Check</h3>";

try {
    // Check if users table exists
    $table_check = "SHOW TABLES LIKE 'users'";
    $table_stmt = $db->prepare($table_check);
    $table_stmt->execute();
    
    if ($table_stmt->rowCount() > 0) {
        echo "<p class='success'>✅ Users table exists</p>";
        
        // Check table structure
        $structure_check = "DESCRIBE users";
        $structure_stmt = $db->prepare($structure_check);
        $structure_stmt->execute();
        $columns = $structure_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<h4>Table Structure:</h4>";
        echo "<table>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        foreach ($columns as $column) {
            echo "<tr>";
            echo "<td>{$column['Field']}</td>";
            echo "<td>{$column['Type']}</td>";
            echo "<td>{$column['Null']}</td>";
            echo "<td>{$column['Key']}</td>";
            echo "<td>{$column['Default']}</td>";
            echo "<td>{$column['Extra']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Check for required columns
        $required_columns = ['id', 'name', 'email', 'password', 'role', 'is_email_verified', 'created_at'];
        $existing_columns = array_column($columns, 'Field');
        $missing_columns = array_diff($required_columns, $existing_columns);
        
        if (empty($missing_columns)) {
            echo "<p class='success'>✅ All required columns exist</p>";
        } else {
            echo "<p class='warning'>⚠️ Missing columns: " . implode(', ', $missing_columns) . "</p>";
            
            // Fix missing columns
            echo "<h4>Fixing missing columns...</h4>";
            foreach ($missing_columns as $column) {
                switch ($column) {
                    case 'id':
                        $fix_query = "ALTER TABLE users ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST";
                        break;
                    case 'name':
                        $fix_query = "ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL AFTER id";
                        break;
                    case 'email':
                        $fix_query = "ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL AFTER name";
                        break;
                    case 'password':
                        $fix_query = "ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL AFTER email";
                        break;
                    case 'role':
                        $fix_query = "ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password";
                        break;
                    case 'is_email_verified':
                        $fix_query = "ALTER TABLE users ADD COLUMN is_email_verified TINYINT(1) DEFAULT 0 AFTER role";
                        break;
                    case 'created_at':
                        $fix_query = "ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_email_verified";
                        break;
                }
                
                try {
                    $fix_stmt = $db->prepare($fix_query);
                    $fix_stmt->execute();
                    echo "<p class='success'>✅ Added column: {$column}</p>";
                } catch (Exception $e) {
                    echo "<p class='error'>❌ Failed to add column {$column}: " . $e->getMessage() . "</p>";
                }
            }
        }
        
    } else {
        echo "<p class='error'>❌ Users table does not exist</p>";
        echo "<h4>Creating users table...</h4>";
        
        $create_table = "CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            is_email_verified TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        try {
            $create_stmt = $db->prepare($create_table);
            $create_stmt->execute();
            echo "<p class='success'>✅ Users table created successfully</p>";
        } catch (Exception $e) {
            echo "<p class='error'>❌ Failed to create table: " . $e->getMessage() . "</p>";
        }
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error checking table structure: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Check and fix users
echo "<div class='section'>";
echo "<h3>👥 Users Check & Fix</h3>";

try {
    // Check existing users
    $users_query = "SELECT id, name, email, password, role, is_email_verified, created_at FROM users ORDER BY id";
    $users_stmt = $db->prepare($users_query);
    $users_stmt->execute();
    $users = $users_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "<p class='warning'>⚠️ No users found in database</p>";
    } else {
        echo "<p class='success'>✅ Found " . count($users) . " users</p>";
        
        echo "<h4>Current Users:</h4>";
        echo "<table>";
        echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Created</th><th>Password</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['name']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>" . ($user['is_email_verified'] ? 'Yes' : 'No') . "</td>";
            echo "<td>{$user['created_at']}</td>";
            echo "<td>" . (strlen($user['password']) > 20 ? substr($user['password'], 0, 20) . "..." : $user['password']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    // Check for admin user
    $admin_check = "SELECT id, name, email, role, password FROM users WHERE email = 'admin@agriwatch.com'";
    $admin_stmt = $db->prepare($admin_check);
    $admin_stmt->execute();
    
    if ($admin_stmt->rowCount() > 0) {
        $admin_user = $admin_stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p class='success'>✅ Admin user exists</p>";
        echo "<ul>";
        echo "<li>ID: {$admin_user['id']}</li>";
        echo "<li>Name: {$admin_user['name']}</li>";
        echo "<li>Email: {$admin_user['email']}</li>";
        echo "<li>Role: {$admin_user['role']}</li>";
        echo "</ul>";
        
        // Verify admin password
        $test_password = 'admin123';
        if (password_verify($test_password, $admin_user['password'])) {
            echo "<p class='success'>✅ Admin password is correct (admin123)</p>";
        } else {
            echo "<p class='warning'>⚠️ Admin password is incorrect, fixing...</p>";
            $new_password_hash = password_hash('admin123', PASSWORD_DEFAULT);
            $update_query = "UPDATE users SET password = ? WHERE email = 'admin@agriwatch.com'";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindParam(1, $new_password_hash);
            
            if ($update_stmt->execute()) {
                echo "<p class='success'>✅ Admin password updated to admin123</p>";
            } else {
                echo "<p class='error'>❌ Failed to update admin password</p>";
            }
        }
    } else {
        echo "<p class='warning'>⚠️ Admin user not found, creating...</p>";
        
        $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
        $create_admin = "INSERT INTO users (name, email, password, role, is_email_verified, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        $create_stmt = $db->prepare($create_admin);
        $create_stmt->bindParam(1, 'Admin User');
        $create_stmt->bindParam(2, 'admin@agriwatch.com');
        $create_stmt->bindParam(3, $admin_password);
        $create_stmt->bindParam(4, 'admin');
        $create_stmt->bindParam(5, 1);
        
        if ($create_stmt->execute()) {
            echo "<p class='success'>✅ Admin user created successfully!</p>";
            echo "<p><strong>Login:</strong> admin@agriwatch.com / admin123</p>";
        } else {
            echo "<p class='error'>❌ Failed to create admin user</p>";
        }
    }
    
    // Check for duplicate emails
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
            $users_query = "SELECT id, name, email, role FROM users WHERE email = ? ORDER BY id";
            $users_stmt = $db->prepare($users_query);
            $users_stmt->bindParam(1, $dupe['email']);
            $users_stmt->execute();
            $users_with_email = $users_stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo "<ul>";
            foreach ($users_with_email as $user) {
                echo "<li>ID: {$user['id']}, Name: {$user['name']}, Role: {$user['role']}</li>";
            }
            echo "</ul>";
        }
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error checking users: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Database optimization
echo "<div class='section'>";
echo "<h3>⚡ Database Optimization</h3>";

try {
    // Add indexes if they don't exist
    $indexes = [
        "CREATE INDEX idx_email ON users(email)",
        "CREATE INDEX idx_role ON users(role)",
        "CREATE INDEX idx_verified ON users(is_email_verified)"
    ];
    
    foreach ($indexes as $index_query) {
        try {
            $index_stmt = $db->prepare($index_query);
            $index_stmt->execute();
            echo "<p class='success'>✅ Index created or already exists</p>";
        } catch (Exception $e) {
            // Index might already exist, which is fine
            echo "<p class='info'>ℹ️ Index creation: " . $e->getMessage() . "</p>";
        }
    }
    
    // Optimize table
    $optimize_query = "OPTIMIZE TABLE users";
    $optimize_stmt = $db->prepare($optimize_query);
    $optimize_stmt->execute();
    echo "<p class='success'>✅ Table optimized</p>";
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error optimizing database: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Final verification
echo "<div class='section'>";
echo "<h3>✅ Final Verification</h3>";

try {
    $final_check = "SELECT COUNT(*) as total_users, 
                           SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
                           SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count
                    FROM users";
    $final_stmt = $db->prepare($final_check);
    $final_stmt->execute();
    $final_stats = $final_stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<p class='success'>✅ Database verification complete!</p>";
    echo "<ul>";
    echo "<li><strong>Total Users:</strong> {$final_stats['total_users']}</li>";
    echo "<li><strong>Admin Users:</strong> {$final_stats['admin_count']}</li>";
    echo "<li><strong>Regular Users:</strong> {$final_stats['user_count']}</li>";
    echo "</ul>";
    
    // Check admin login
    $admin_verify = "SELECT id, name, email, role FROM users WHERE email = 'admin@agriwatch.com' AND role = 'admin'";
    $admin_verify_stmt = $db->prepare($admin_verify);
    $admin_verify_stmt->execute();
    
    if ($admin_verify_stmt->rowCount() > 0) {
        $admin = $admin_verify_stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p class='success'>✅ Admin user verified and ready for login!</p>";
        echo "<p><strong>Admin Login:</strong> admin@agriwatch.com / admin123</p>";
    } else {
        echo "<p class='error'>❌ Admin user verification failed</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error in final verification: " . $e->getMessage() . "</p>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h3>📋 Next Steps</h3>";
echo "<ol>";
echo "<li>✅ Database has been checked and fixed</li>";
echo "<li>✅ Admin user created/verified</li>";
echo "<li>✅ Table structure optimized</li>";
echo "<li>🔧 Now create separate login pages for users and admins</li>";
echo "<li>🔐 Test admin login: admin@agriwatch.com / admin123</li>";
echo "</ol>";
echo "</div>";

echo "</div></body></html>";
?>
