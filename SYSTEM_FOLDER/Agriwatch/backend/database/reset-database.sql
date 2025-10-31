-- ========================================
-- AgriWatch - Complete Database Reset (SQL)
-- ========================================
-- Run this in phpMyAdmin to completely reset your database
-- ========================================

-- Step 1: Drop existing database
DROP DATABASE IF EXISTS agriwatch;

-- Step 2: Create new database
CREATE DATABASE agriwatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Step 3: Use the new database
USE agriwatch;

-- Step 4: Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Create crops table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 6: Create weather_data table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 7: Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_email_verified) 
VALUES ('Admin User', 'admin@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1);

-- Step 8: Insert sample user (password: user123)
INSERT INTO users (name, email, password, role, is_email_verified) 
VALUES ('John Doe', 'user@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1);

-- Step 9: Insert sample crops
INSERT INTO crops (name, description, planting_season, harvest_time, water_requirements, soil_type) VALUES 
('Rice', 'Staple food crop, requires warm climate and plenty of water', 'Spring', '3-4 months', 'High', 'Clay loam'),
('Wheat', 'Winter crop, drought resistant', 'Winter', '4-5 months', 'Medium', 'Loamy soil'),
('Corn', 'Summer crop, requires warm soil', 'Summer', '3-4 months', 'High', 'Well-drained soil'),
('Tomatoes', 'Warm season vegetable', 'Spring', '2-3 months', 'Medium', 'Rich loamy soil');

-- Step 10: Insert sample weather data
INSERT INTO weather_data (date, temperature_high, temperature_low, humidity, rainfall, wind_speed, description) VALUES 
('2024-01-15', 25.5, 18.2, 65.0, 0.0, 12.5, 'Partly cloudy'),
('2024-01-16', 27.8, 19.1, 70.0, 5.2, 8.3, 'Light rain'),
('2024-01-17', 26.3, 17.8, 68.0, 0.0, 15.2, 'Sunny');

-- Step 11: Verify the setup
SELECT 'Database Reset Complete!' as status;
SELECT 'Tables created:' as info;
SHOW TABLES;
SELECT 'Users created:' as info;
SELECT name, email, role, is_email_verified FROM users;
SELECT 'Sample crops added:' as info;
SELECT name, planting_season, water_requirements FROM crops;
SELECT 'Sample weather data:' as info;
SELECT date, temperature_high, temperature_low, description FROM weather_data;

-- ========================================
-- Login Credentials After Reset:
-- ========================================
-- Admin: admin@agriwatch.com / admin123
-- User: user@agriwatch.com / user123
-- ========================================
