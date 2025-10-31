<?php
// Simple discovery endpoint for ESP8266
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Device-Id, X-Api-Key');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Return server information
$response = [
    'status' => 'success',
    'message' => 'AgriWatch Server Found',
    'server_ip' => $_SERVER['SERVER_ADDR'],
    'timestamp' => date('Y-m-d H:i:s'),
    'version' => '1.0.0'
];

http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT);
?>
