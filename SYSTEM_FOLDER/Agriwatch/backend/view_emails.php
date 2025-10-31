<?php
echo "<h1>🌱 AgriWatch - Email Log</h1>";
echo "<p>This shows all emails that would be sent in development mode:</p>";
echo "<hr>";

$logFile = 'email_log.txt';

if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    if (!empty($content)) {
        echo "<pre style='background: #f8f9fa; padding: 20px; border-radius: 8px; white-space: pre-wrap;'>";
        echo htmlspecialchars($content);
        echo "</pre>";
    } else {
        echo "<p>No emails have been sent yet.</p>";
    }
} else {
    echo "<p>No email log file found. Try signing up or requesting a password reset to generate emails.</p>";
}

echo "<hr>";
echo "<p><strong>Note:</strong> In production, these would be actual emails sent to users.</p>";
echo "<p>For testing, you can copy the verification/reset links from the log above.</p>";
?>
