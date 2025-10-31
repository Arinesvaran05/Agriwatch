-- AgriWatch Database Update Script for IoT Device Support
-- Run this script to add IoT device functionality to your existing database

USE agriwatch;

-- Add device_id column to existing sensor tables if they don't exist
ALTER TABLE temperature_readings 
ADD COLUMN IF NOT EXISTS device_id VARCHAR(100) DEFAULT 'ESP8266_001',
ADD COLUMN IF NOT EXISTS unit VARCHAR(10) DEFAULT '°C',
ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Greenhouse A';

ALTER TABLE humidity_readings 
ADD COLUMN IF NOT EXISTS device_id VARCHAR(100) DEFAULT 'ESP8266_001',
ADD COLUMN IF NOT EXISTS unit VARCHAR(10) DEFAULT '%',
ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Greenhouse A';

ALTER TABLE soil_moisture_readings 
ADD COLUMN IF NOT EXISTS device_id VARCHAR(100) DEFAULT 'ESP8266_001',
ADD COLUMN IF NOT EXISTS unit VARCHAR(10) DEFAULT '%',
ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Greenhouse A';

-- Create IoT Devices table
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    status ENUM('online', 'offline', 'maintenance') DEFAULT 'offline',
    last_seen TIMESTAMP NULL,
    firmware_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_status (status),
    INDEX idx_last_seen (last_seen)
);

-- Create Device logs table
CREATE TABLE IF NOT EXISTS device_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_received TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_last_seen (last_seen)
);

-- Create Sensor alerts table
CREATE TABLE IF NOT EXISTS sensor_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL,
    sensor_type ENUM('temperature', 'humidity', 'soil_moisture') NOT NULL,
    alert_type ENUM('high', 'low', 'critical') NOT NULL,
    threshold_value DECIMAL(5,2) NOT NULL,
    current_value DECIMAL(5,2) NOT NULL,
    message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    INDEX idx_device_id (device_id),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_is_active (is_active)
);

-- Insert default IoT device
INSERT IGNORE INTO devices (device_id, name, description, location, status, firmware_version) VALUES 
('ESP8266_001', 'AgriWatch Sensor Node 1', 'Main greenhouse sensor node', 'Greenhouse A', 'online', '1.0.0');

-- Update existing sensor data with device information
UPDATE temperature_readings SET device_id = 'ESP8266_001', location = 'Greenhouse A' WHERE device_id IS NULL OR device_id = '';
UPDATE humidity_readings SET device_id = 'ESP8266_001', location = 'Greenhouse A' WHERE device_id IS NULL OR device_id = '';
UPDATE soil_moisture_readings SET device_id = 'ESP8266_001', location = 'Greenhouse A' WHERE device_id IS NULL OR device_id = '';

-- Create views for easier data access
DROP VIEW IF EXISTS latest_sensor_readings;
CREATE VIEW latest_sensor_readings AS
SELECT 
    'temperature' as sensor_type,
    tr.value,
    tr.timestamp,
    tr.device_id,
    tr.unit,
    tr.location
FROM temperature_readings tr
WHERE tr.timestamp = (
    SELECT MAX(timestamp) 
    FROM temperature_readings tr2 
    WHERE tr2.device_id = tr.device_id
)
UNION ALL
SELECT 
    'humidity' as sensor_type,
    hr.value,
    hr.timestamp,
    hr.device_id,
    hr.unit,
    hr.location
FROM humidity_readings hr
WHERE hr.timestamp = (
    SELECT MAX(timestamp) 
    FROM humidity_readings hr2 
    WHERE hr2.device_id = hr.device_id
)
UNION ALL
SELECT 
    'soil_moisture' as sensor_type,
    sr.value,
    sr.timestamp,
    sr.device_id,
    sr.unit,
    sr.location
FROM soil_moisture_readings sr
WHERE sr.timestamp = (
    SELECT MAX(timestamp) 
    FROM soil_moisture_readings sr2 
    WHERE sr2.device_id = sr.device_id
);

-- Create view for device status
DROP VIEW IF EXISTS device_status;
CREATE VIEW device_status AS
SELECT 
    d.*,
    CASE 
        WHEN d.last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'online'
        WHEN d.last_seen > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 'offline'
        ELSE 'offline'
    END as connection_status,
    (SELECT COUNT(*) FROM temperature_readings tr WHERE tr.device_id = d.device_id) as temp_readings_count,
    (SELECT COUNT(*) FROM humidity_readings hr WHERE hr.device_id = d.device_id) as humidity_readings_count,
    (SELECT COUNT(*) FROM soil_moisture_readings sr WHERE sr.device_id = sr.device_id) as soil_readings_count
FROM devices d;

-- Add foreign key constraints if they don't exist
-- Note: These might fail if there's existing data that doesn't match
-- You can comment these out if you encounter issues

/*
ALTER TABLE temperature_readings 
ADD CONSTRAINT fk_temp_device 
FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE;

ALTER TABLE humidity_readings 
ADD CONSTRAINT fk_humidity_device 
FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE;

ALTER TABLE soil_moisture_readings 
ADD CONSTRAINT fk_soil_device 
FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE;

ALTER TABLE device_logs 
ADD CONSTRAINT fk_logs_device 
FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE;

ALTER TABLE sensor_alerts 
ADD CONSTRAINT fk_alerts_device 
FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE;
*/

-- Insert sample alerts for testing
INSERT IGNORE INTO sensor_alerts (device_id, sensor_type, alert_type, threshold_value, current_value, message) VALUES 
('ESP8266_001', 'temperature', 'high', 30.0, 32.5, 'Temperature is above optimal range for plant growth'),
('ESP8266_001', 'humidity', 'low', 40.0, 35.2, 'Humidity is below recommended levels'),
('ESP8266_001', 'soil_moisture', 'low', 30.0, 25.8, 'Soil moisture is critically low - irrigation needed');

-- Update device last_seen to current time
UPDATE devices SET last_seen = NOW() WHERE device_id = 'ESP8266_001';

-- Show summary of changes
SELECT 'Database updated successfully!' as status;
SELECT COUNT(*) as temperature_readings FROM temperature_readings;
SELECT COUNT(*) as humidity_readings FROM humidity_readings;
SELECT COUNT(*) as soil_moisture_readings FROM soil_moisture_readings;
SELECT COUNT(*) as devices FROM devices;
SELECT COUNT(*) as alerts FROM sensor_alerts;

-- Show device status
SELECT * FROM device_status;
