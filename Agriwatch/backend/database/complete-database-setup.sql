-- ========================================
-- AgriWatch - Complete Database Setup (ALL TABLES)
-- ========================================
-- This script will create a complete database with:
-- 1. ALL necessary tables (including missing ones)
-- 2. 2 Admin accounts
-- 3. 3 User accounts
-- 4. Sample crops data
-- 5. Sample weather data
-- 6. Sample sensor data
-- ========================================

-- ========================================
-- STEP 1: Create Users Table
-- ========================================
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

-- ========================================
-- STEP 2: Create Email Verification Table
-- ========================================
CREATE TABLE email_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 3: Create Password Reset Table
-- ========================================
CREATE TABLE password_reset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 4: Create Crops Table
-- ========================================
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

-- ========================================
-- STEP 5: Create Weather Data Table
-- ========================================
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

-- ========================================
-- STEP 6: Create Soil Moisture Table
-- ========================================
CREATE TABLE soil_moisture (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(100),
    moisture_level DECIMAL(5,2) NOT NULL,
    soil_type VARCHAR(100),
    location VARCHAR(255),
    reading_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sensor_id (sensor_id),
    INDEX idx_reading_time (reading_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 7: Create Humidity Table
-- ========================================
CREATE TABLE humidity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(100),
    humidity_level DECIMAL(5,2) NOT NULL,
    temperature DECIMAL(5,2),
    location VARCHAR(255),
    reading_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sensor_id (sensor_id),
    INDEX idx_reading_time (reading_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 8: Create Temperature Table
-- ========================================
CREATE TABLE temperature (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(100),
    temperature_level DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2),
    location VARCHAR(255),
    reading_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sensor_id (sensor_id),
    INDEX idx_reading_time (reading_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 9: Create Sensors Table
-- ========================================
CREATE TABLE sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(100) UNIQUE NOT NULL,
    sensor_type ENUM('temperature', 'humidity', 'soil_moisture', 'rainfall') NOT NULL,
    location VARCHAR(255),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    last_reading TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sensor_id (sensor_id),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 10: Create Device Table
-- ========================================
CREATE TABLE device (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    device_type VARCHAR(100),
    status ENUM('online', 'offline', 'error') DEFAULT 'offline',
    last_seen TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_device_name (device_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- STEP 11: Insert Admin Users
-- ========================================
-- Admin 1: admin@agriwatch.com / admin123
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Admin User', 'admin@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1);

-- Admin 2: superadmin@agriwatch.com / admin123
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Super Admin', 'superadmin@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1);

-- ========================================
-- STEP 12: Insert User Accounts
-- ========================================
-- User 1: user@agriwatch.com / user123
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('John Doe', 'user@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1);

-- User 2: jane@agriwatch.com / user123
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Jane Smith', 'jane@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1);

-- User 3: mike@agriwatch.com / user123
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Mike Johnson', 'mike@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1);

-- ========================================
-- STEP 13: Insert Sample Crops
-- ========================================
INSERT INTO crops (name, description, planting_season, harvest_time, water_requirements, soil_type) VALUES 
('Rice', 'Staple food crop, requires warm climate and plenty of water', 'Spring', '3-4 months', 'High', 'Clay loam'),
('Wheat', 'Winter crop, drought resistant', 'Winter', '4-5 months', 'Medium', 'Loamy soil'),
('Corn', 'Summer crop, requires warm soil', 'Summer', '3-4 months', 'High', 'Well-drained soil'),
('Tomatoes', 'Warm season vegetable', 'Spring', '2-3 months', 'Medium', 'Rich loamy soil'),
('Potatoes', 'Cool season crop, requires loose soil', 'Spring', '3-4 months', 'Medium', 'Sandy loam'),
('Lettuce', 'Fast growing leafy vegetable', 'Spring/Fall', '6-8 weeks', 'Medium', 'Rich organic soil'),
('Carrots', 'Root vegetable, requires loose soil', 'Spring', '2-3 months', 'Medium', 'Sandy loam'),
('Onions', 'Bulb vegetable, long growing season', 'Spring', '3-4 months', 'Medium', 'Well-drained soil');

-- ========================================
-- STEP 14: Insert Sample Weather Data
-- ========================================
INSERT INTO weather_data (date, temperature_high, temperature_low, humidity, rainfall, wind_speed, description) VALUES 
('2024-01-15', 25.5, 18.2, 65.0, 0.0, 12.5, 'Partly cloudy'),
('2024-01-16', 27.8, 19.1, 70.0, 5.2, 8.3, 'Light rain'),
('2024-01-17', 26.3, 17.8, 68.0, 0.0, 15.2, 'Sunny'),
('2024-01-18', 24.7, 17.5, 72.0, 2.1, 10.8, 'Overcast'),
('2024-01-19', 28.1, 20.3, 63.0, 0.0, 14.5, 'Clear sky'),
('2024-01-20', 29.5, 21.8, 58.0, 0.0, 11.2, 'Hot and dry'),
('2024-01-21', 23.2, 16.7, 75.0, 8.5, 6.8, 'Heavy rain'),
('2024-01-22', 22.8, 15.9, 78.0, 3.2, 9.1, 'Wet and humid');

-- ========================================
-- STEP 15: Insert Sample Soil Moisture Data
-- ========================================
INSERT INTO soil_moisture (sensor_id, moisture_level, soil_type, location) VALUES 
('SM001', 45.2, 'Clay loam', 'Field A - North'),
('SM002', 38.7, 'Sandy loam', 'Field A - South'),
('SM003', 52.1, 'Loamy soil', 'Field B - East'),
('SM004', 41.8, 'Rich organic', 'Field B - West'),
('SM005', 47.3, 'Well-drained', 'Field C - Center');

-- ========================================
-- STEP 16: Insert Sample Humidity Data
-- ========================================
INSERT INTO humidity (sensor_id, humidity_level, temperature, location) VALUES 
('H001', 68.5, 24.2, 'Field A - North'),
('H002', 72.1, 23.8, 'Field A - South'),
('H003', 65.3, 25.1, 'Field B - East'),
('H004', 70.8, 22.9, 'Field B - West'),
('H005', 66.7, 24.7, 'Field C - Center');

-- ========================================
-- STEP 17: Insert Sample Temperature Data
-- ========================================
INSERT INTO temperature (sensor_id, temperature_level, humidity, location) VALUES 
('T001', 24.2, 68.5, 'Field A - North'),
('T002', 23.8, 72.1, 'Field A - South'),
('T003', 25.1, 65.3, 'Field B - East'),
('T004', 22.9, 70.8, 'Field B - West'),
('T005', 24.7, 66.7, 'Field C - Center');

-- ========================================
-- STEP 18: Insert Sample Sensors
-- ========================================
INSERT INTO sensors (sensor_id, sensor_type, location, status) VALUES 
('SM001', 'soil_moisture', 'Field A - North', 'active'),
('SM002', 'soil_moisture', 'Field A - South', 'active'),
('H001', 'humidity', 'Field A - North', 'active'),
('H002', 'humidity', 'Field A - South', 'active'),
('T001', 'temperature', 'Field A - North', 'active'),
('T002', 'temperature', 'Field A - South', 'active');

-- ========================================
-- STEP 19: Insert Sample Devices
-- ========================================
INSERT INTO device (device_name, device_type, status) VALUES 
('Weather Station 1', 'weather_monitor', 'online'),
('Soil Monitor 1', 'soil_sensor', 'online'),
('Humidity Monitor 1', 'humidity_sensor', 'online'),
('Temperature Monitor 1', 'temperature_sensor', 'online');

-- ========================================
-- STEP 20: Verify Setup
-- ========================================
-- Check tables
SELECT 'Database Setup Complete!' as status;
SELECT 'Tables created:' as info;
SHOW TABLES;

-- Check users
SELECT 'Users created:' as info;
SELECT id, name, email, role, is_email_verified FROM users ORDER BY role, id;

-- Check crops
SELECT 'Sample crops added:' as info;
SELECT id, name, planting_season, water_requirements FROM crops ORDER BY id;

-- Check weather data
SELECT 'Sample weather data:' as info;
SELECT id, date, temperature_high, temperature_low, description FROM weather_data ORDER BY date;

-- Check sensor data
SELECT 'Sample sensor data:' as info;
SELECT 'Soil Moisture' as type, COUNT(*) as count FROM soil_moisture
UNION ALL
SELECT 'Humidity' as type, COUNT(*) as count FROM humidity
UNION ALL
SELECT 'Temperature' as type, COUNT(*) as count FROM temperature;

-- ========================================
-- LOGIN CREDENTIALS
-- ========================================
-- ADMIN ACCOUNTS:
-- 1. Email: admin@agriwatch.com | Password: admin123
-- 2. Email: superadmin@agriwatch.com | Password: admin123
--
-- USER ACCOUNTS:
-- 1. Email: user@agriwatch.com | Password: user123
-- 2. Email: jane@agriwatch.com | Password: user123
-- 3. Email: mike@agriwatch.com | Password: user123
-- ========================================
