-- Enhanced AgriWatch Database Schema with IoT Device Support
-- This schema adds device tracking and improved sensor data management

-- Create database
CREATE DATABASE IF NOT EXISTS agriwatch;
USE agriwatch;

-- Users table (existing)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_expires DATETIME,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_verification_token (verification_token),
    INDEX idx_reset_token (reset_token)
);

-- IoT Devices table (new)
CREATE TABLE devices (
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

-- Device logs table (new)
CREATE TABLE device_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_received TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_last_seen (last_seen),
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Enhanced Temperature readings table
CREATE TABLE temperature_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(100) NOT NULL,
    unit VARCHAR(10) DEFAULT '°C',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_device_id (device_id),
    INDEX idx_value (value),
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Enhanced Humidity readings table
CREATE TABLE humidity_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(100) NOT NULL,
    unit VARCHAR(10) DEFAULT '%',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_device_id (device_id),
    INDEX idx_value (value),
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Enhanced Soil moisture readings table
CREATE TABLE soil_moisture_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(100) NOT NULL,
    unit VARCHAR(10) DEFAULT '%',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_device_id (device_id),
    INDEX idx_value (value),
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Sensor alerts table (new)
CREATE TABLE sensor_alerts (
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
    INDEX idx_is_active (is_active),
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Crops table (existing)
CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    planting_season VARCHAR(100),
    harvest_time VARCHAR(100),
    water_requirements VARCHAR(100),
    soil_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Weather data table (existing)
CREATE TABLE weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    temperature_high DECIMAL(5,2),
    temperature_low DECIMAL(5,2),
    humidity DECIMAL(5,2),
    rainfall DECIMAL(8,2),
    wind_speed DECIMAL(5,2),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- Insert default admin user
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Admin User', 'admin@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert sample user
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('John Doe', 'user@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', TRUE);

-- Insert default IoT device
INSERT INTO devices (device_id, name, description, location, status, firmware_version) VALUES 
('ESP8266_001', 'AgriWatch Sensor Node 1', 'Main greenhouse sensor node', 'Greenhouse A', 'online', '1.0.0');

-- Insert sample sensor data with device tracking
INSERT INTO temperature_readings (value, timestamp, device_id, location) VALUES 
(25.5, NOW() - INTERVAL 1 HOUR, 'ESP8266_001', 'Greenhouse A'),
(26.2, NOW() - INTERVAL 30 MINUTE, 'ESP8266_001', 'Greenhouse A'),
(24.8, NOW() - INTERVAL 15 MINUTE, 'ESP8266_001', 'Greenhouse A'),
(25.1, NOW(), 'ESP8266_001', 'Greenhouse A');

INSERT INTO humidity_readings (value, timestamp, device_id, location) VALUES 
(65.2, NOW() - INTERVAL 1 HOUR, 'ESP8266_001', 'Greenhouse A'),
(68.5, NOW() - INTERVAL 30 MINUTE, 'ESP8266_001', 'Greenhouse A'),
(67.1, NOW() - INTERVAL 15 MINUTE, 'ESP8266_001', 'Greenhouse A'),
(66.8, NOW(), 'ESP8266_001', 'Greenhouse A');

INSERT INTO soil_moisture_readings (value, timestamp, device_id, location) VALUES 
(45.3, NOW() - INTERVAL 1 HOUR, 'ESP8266_001', 'Greenhouse A'),
(47.8, NOW() - INTERVAL 30 MINUTE, 'ESP8266_001', 'Greenhouse A'),
(46.2, NOW() - INTERVAL 15 MINUTE, 'ESP8266_001', 'Greenhouse A'),
(46.9, NOW(), 'ESP8266_001', 'Greenhouse A');

-- Insert sample crops
INSERT INTO crops (name, description, planting_season, harvest_time, water_requirements, soil_type) VALUES 
('Rice', 'Staple food crop, requires warm climate and plenty of water', 'Spring', '3-4 months', 'High', 'Clay loam'),
('Wheat', 'Winter crop, drought resistant', 'Winter', '4-5 months', 'Medium', 'Loamy soil'),
('Corn', 'Summer crop, requires warm soil', 'Summer', '3-4 months', 'High', 'Well-drained soil'),
('Tomatoes', 'Warm season vegetable', 'Spring', '2-3 months', 'Medium', 'Rich loamy soil');

-- Insert sample weather data
INSERT INTO weather_data (date, temperature_high, temperature_low, humidity, rainfall, wind_speed, description) VALUES 
('2024-01-15', 25.5, 18.2, 65.0, 0.0, 12.5, 'Partly cloudy'),
('2024-01-16', 27.8, 19.1, 70.0, 5.2, 8.3, 'Light rain'),
('2024-01-17', 26.3, 17.8, 68.0, 0.0, 15.2, 'Sunny');

-- Create views for easier data access
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
    (SELECT COUNT(*) FROM soil_moisture_readings sr WHERE sr.device_id = d.device_id) as soil_readings_count
FROM devices d;
