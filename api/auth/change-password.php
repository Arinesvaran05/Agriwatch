<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['currentPassword']) || !isset($input['newPassword'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Current password and new password are required"]);
    exit();
}

$currentPassword = $input['currentPassword'];
$newPassword = $input['newPassword'];

// Validate password length
if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New password must be at least 6 characters long"]);
    exit();
}

// Create database connection
$database = new Database();
$db = $database->getConnection();

try {
    // For demo purposes, we'll use a hardcoded admin user
    // In a real application, you would get the user ID from the session/token
    
    // Check if current password matches (for admin user)
    $adminPassword = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // admin123
    
    if (!password_verify($currentPassword, $adminPassword)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
        exit();
    }
    
    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update the password in database
    $query = "UPDATE users SET password = ? WHERE email = 'admin@agriwatch.com'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $hashedPassword);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Password changed successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update password"
        ]);
    }
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $exception->getMessage()
    ]);
}
?>
