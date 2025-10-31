<?php
require_once '../../../config/cors.php';
require_once '../../../config/database.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=soil_moisture_log_' . date('Ymd_His') . '.csv');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$limit = min(max($limit, 1), 200);

$database = new Database();
$db = $database->getConnection();
if ($db === null) {
    echo "id,value,timestamp\n";
    exit;
}

$query = "SELECT id, value, timestamp FROM soil_moisture_readings ORDER BY timestamp DESC LIMIT :limit";
$stmt = $db->prepare($query);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->execute();

echo "\xEF\xBB\xBF";
$output = fopen('php://output', 'w');
fputcsv($output, ['AgriWatch Export']);
fputcsv($output, ['sensor', 'soil_moisture']);
fputcsv($output, ['generated_at', date('Y-m-d H:i:s')]);
fputcsv($output, ['timezone', 'Asia/Kuala_Lumpur']);
fputcsv($output, ['limit', $limit]);
fputcsv($output, []);

// Data header - simplified to match web interface
fputcsv($output, ['id', 'sensor_type', 'value', 'unit', 'timestamp']);
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Format timestamp to be Excel-friendly and prevent ##### display issue
    $formattedTimestamp = "\t" . $row['timestamp'];
    fputcsv($output, [
        $row['id'],
        'soil_moisture',
        $row['value'],
        '%',
        $formattedTimestamp
    ]);
}
fclose($output);
?>


