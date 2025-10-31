# 🗄️ Database Setup Guide for AgriWatch

This guide provides detailed step-by-step instructions for setting up the AgriWatch database using XAMPP and phpMyAdmin.

## 📋 Prerequisites

- XAMPP installed and running
- Web browser (Chrome, Firefox, Edge, etc.)

## 🚀 Step-by-Step Database Setup

### Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
   - Windows: Press `Win + R`, type `xampp`, press Enter
   - Or search for "XAMPP" in the Start menu

2. **Start Required Services**
   - Click "Start" next to **Apache**
   - Click "Start" next to **MySQL**
   - Wait for both services to show **green** status

   ![XAMPP Control Panel](https://i.imgur.com/example1.png)

### Step 2: Access phpMyAdmin

1. **Open phpMyAdmin**
   - Open your web browser
   - Navigate to: `http://localhost/phpmyadmin`
   - You should see the phpMyAdmin interface

2. **Verify Connection**
   - Look for "Server: localhost" at the top
   - Ensure no error messages are displayed

### Step 3: Create Database

1. **Create New Database**
   - Click "**New**" in the left sidebar
   - In the "Create database" field, enter: `agriwatch`
   - Select "**utf8mb4_general_ci**" as collation
   - Click "**Create**"

2. **Verify Database Creation**
   - You should see `agriwatch` in the left sidebar
   - The database should be empty initially

### Step 4: Import Database Schema

1. **Select Database**
   - Click on `agriwatch` in the left sidebar
   - The database should be highlighted

2. **Import SQL File**
   - Click the "**Import**" tab at the top
   - Click "**Choose File**" button
   - Navigate to your project folder
   - Select: `database/schema.sql`
   - Click "**Go**" to start import

3. **Verify Import Success**
   - You should see a success message
   - Check that 4 tables were created:
     - `users`
     - `temperature_readings`
     - `humidity_readings`
     - `soil_moisture_readings`

### Step 5: Verify Data Import

1. **Check Tables**
   - Click on each table name in the left sidebar
   - Verify data exists in each table

2. **Check Sample Data**
   - **users table**: Should have 1 admin user
   - **temperature_readings**: Should have 4 sample readings
   - **humidity_readings**: Should have 4 sample readings
   - **soil_moisture_readings**: Should have 4 sample readings

## 🔍 Manual Database Creation (Alternative Method)

If the import doesn't work, you can create the database manually:

### 1. Create Tables

```sql
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
```

### 2. Insert Sample Data

```sql
-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_email_verified) VALUES 
('Admin User', 'admin@agriwatch.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert sample temperature data
INSERT INTO temperature_readings (value, timestamp) VALUES 
(25.5, NOW() - INTERVAL 1 HOUR),
(26.2, NOW() - INTERVAL 30 MINUTE),
(24.8, NOW() - INTERVAL 15 MINUTE),
(25.1, NOW());

-- Insert sample humidity data
INSERT INTO humidity_readings (value, timestamp) VALUES 
(65.2, NOW() - INTERVAL 1 HOUR),
(68.5, NOW() - INTERVAL 30 MINUTE),
(67.1, NOW() - INTERVAL 15 MINUTE),
(66.8, NOW());

-- Insert sample soil moisture data
INSERT INTO soil_moisture_readings (value, timestamp) VALUES 
(45.3, NOW() - INTERVAL 1 HOUR),
(47.8, NOW() - INTERVAL 30 MINUTE),
(46.2, NOW() - INTERVAL 15 MINUTE),
(46.9, NOW());
```

## 🔧 Database Configuration

### Check Database Connection

1. **Verify Configuration File**
   - Open: `api/config/database.php`
   - Ensure settings match your XAMPP installation:

```php
private $host = "localhost";
private $db_name = "agriwatch";
private $username = "root";
private $password = "";
```

2. **Test Connection**
   - Navigate to: `http://localhost/agriwatch/api/sensors/temperature/current.php`
   - You should see JSON response with temperature data

## 🚨 Troubleshooting

### Common Issues

1. **"Access denied" Error**
   - Check if MySQL is running in XAMPP
   - Verify username/password in database.php
   - Default XAMPP credentials: username=`root`, password=`` (empty)

2. **"Database doesn't exist" Error**
   - Ensure you created the `agriwatch` database
   - Check spelling and case sensitivity
   - Try refreshing phpMyAdmin

3. **Import Fails**
   - Check file size limits in phpMyAdmin
   - Try importing SQL commands manually
   - Verify SQL file syntax

4. **Connection Timeout**
   - Check if MySQL service is running
   - Restart XAMPP services
   - Check firewall settings

### Reset Database

If you need to start over:

1. **Drop Database**
   - Select `agriwatch` database
   - Click "**Operations**" tab
   - Click "**Drop the database**"
   - Confirm deletion

2. **Recreate Database**
   - Follow steps 3-4 above to recreate

## 📊 Database Structure Overview

### Tables Description

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts and authentication | id, email, password, role |
| `temperature_readings` | Temperature sensor data | id, value, timestamp |
| `humidity_readings` | Humidity sensor data | id, value, timestamp |
| `soil_moisture_readings` | Soil moisture sensor data | id, value, timestamp |

### Relationships

- All sensor tables are independent
- Users table is separate from sensor data
- No foreign key relationships (for simplicity)

## 🔐 Security Notes

1. **Default Admin Account**
   - Email: `admin@agriwatch.com`
   - Password: `admin123`
   - **Change this password in production!**

2. **Database Security**
   - Default XAMPP has no root password
   - Set strong passwords for production
   - Restrict database access

## ✅ Verification Checklist

- [ ] XAMPP Apache and MySQL are running
- [ ] phpMyAdmin is accessible at `http://localhost/phpmyadmin`
- [ ] `agriwatch` database exists
- [ ] All 4 tables are created
- [ ] Sample data is imported
- [ ] API endpoint returns JSON data
- [ ] Admin login works in the application

## 🎯 Next Steps

After database setup:

1. **Test the Application**
   - Login with admin credentials
   - Verify sensor data displays correctly
   - Test all features

2. **Add Real Data**
   - Connect actual IoT devices
   - Replace sample data with real sensor readings

3. **Backup Database**
   - Export database regularly
   - Keep backup copies safe

---

**Database setup complete! 🌱**

Your AgriWatch system is now ready to monitor agricultural data.
