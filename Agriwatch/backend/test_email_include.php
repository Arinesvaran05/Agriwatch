<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "__DIR__: " . __DIR__ . "\n";
$path = __DIR__ . '/vendor/phpmailer/Exception.php';
echo "Direct path: $path\n";
var_dump(file_exists($path));

$configPath = __DIR__ . '/config/../../vendor/phpmailer/Exception.php';
echo "Config-style path: $configPath\n";
var_dump(file_exists($configPath));

require_once $configPath;
echo "Included Exception.php successfully";
?>


