<?php
// Database configuration
class Database {
    private $host = "localhost";
    private $db_name = "agriwatch";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8";
            $options = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_PERSISTENT => false // Don't use persistent connections
            );
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            // Align MySQL session time zone to Malaysia (UTC+08:00)
            $this->conn->exec("SET time_zone = '+08:00'");
            
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }
}
?>
