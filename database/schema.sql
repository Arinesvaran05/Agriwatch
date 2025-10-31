-- AgriWatch Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS agriwatch;
USE agriwatch;

-- Users table
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

-- Temperature readings table
CREATE TABLE temperature_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp)
);

-- Humidity readings table
CREATE TABLE humidity_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp)
);

-- Soil moisture readings table
CREATE TABLE soil_moisture_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Admin User', 'admin@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert sample sensor data
INSERT INTO temperature_readings (value, timestamp) VALUES 
(25.5, NOW() - INTERVAL 1 HOUR),
(26.2, NOW() - INTERVAL 30 MINUTE),
(24.8, NOW() - INTERVAL 15 MINUTE),
(25.1, NOW());

INSERT INTO humidity_readings (value, timestamp) VALUES 
(65.2, NOW() - INTERVAL 1 HOUR),
(68.5, NOW() - INTERVAL 30 MINUTE),
(67.1, NOW() - INTERVAL 15 MINUTE),
(66.8, NOW());

INSERT INTO soil_moisture_readings (value, timestamp) VALUES 
(45.3, NOW() - INTERVAL 1 HOUR),
(47.8, NOW() - INTERVAL 30 MINUTE),
(46.2, NOW() - INTERVAL 15 MINUTE),
(46.9, NOW());
