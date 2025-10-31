<?php
// Simple test endpoint for device connectivity
require_once '../../config/cors.php';

// Set timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

// Log the request
error_log("AgriWatch Test Endpoint Hit: " . date('Y-m-d H:i:s'));
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'));
error_log("Remote IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown'));

// Get headers
$headers = getallheaders();
error_log("Headers: " . json_encode($headers));

// Get POST data if any
$input = file_get_contents("php://input");
if ($input) {
    error_log("POST Data: " . $input);
}

// Simple response
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'AgriWatch test endpoint is working',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_time' => time(),
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'headers_received' => $headers
]);
?>
