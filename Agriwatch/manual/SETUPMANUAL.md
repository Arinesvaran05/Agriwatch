# 🌱 AgriWatch - Complete Setup Manual

This manual provides step-by-step instructions to set up and run the AgriWatch project from GitHub on your local machine or server. The project consists of three main components: **Website (Frontend + Backend)**, **IoT Device**, and **Database**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Website Setup](#website-setup)
   - [Backend Setup (PHP)](#backend-setup-php)
   - [Frontend Setup (Angular)](#frontend-setup-angular)
4. [IoT Device Setup](#iot-device-setup)
5. [Configuration](#configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

Before starting, ensure you have the following installed:

### Required Software:
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **PHP** (v7.4 or higher) - Included in XAMPP
- **MySQL** (v8.0 or higher) - Included in XAMPP
- **XAMPP** (Apache + MySQL + PHP) - [Download](https://www.apachefriends.org/)
- **Git** - [Download](https://git-scm.com/)
- **Arduino IDE** (for IoT device) - [Download](https://www.arduino.cc/en/software)

### Hardware Requirements (for IoT):
- **ESP8266 Development Board** (NodeMCU or similar)
- **DHT11 Temperature & Humidity Sensor**
- **Soil Moisture Sensor (Analog)**
- **Jumper Wires**
- **USB Cable** (for ESP8266)

---
make sure the file path is like this (xampp\htdocs\agriwatch)
## 🗄️ Database Setup

### Step 1: Start MySQL Service

1. Open **XAMPP Control Panel**
2. Start **MySQL** service
3. Ensure MySQL is running (status should show green)

### Step 2: Access phpMyAdmin

1. Open your web browser
2. Navigate to: `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin interface

### Step 3: Create Database

1. Click on **"New"** in the left sidebar
2. Enter database name: `agriwatch`
3. Select collation: `utf8mb4_unicode_ci`
4. Click **"Create"**

### Step 4: Import Database Schema

**Option A: Using phpMyAdmin**
1. Select the `agriwatch` database
2. Click on the **"Import"** tab
3. Click **"Choose File"**
4. Navigate to: `backend/database/schema.sql`
5. Click **"Go"** to import

**Option B: Using Command Line**
```bash
# Navigate to project directory
cd C:\xampp\htdocs\agriwatch

# Import schema using MySQL command line
C:\xampp\mysql\bin\mysql.exe -u root -p agriwatch < backend\database\schema.sql
# (Press Enter when prompted for password - default is empty)
```

### Step 5: Verify Database Setup

1. In phpMyAdmin, select `agriwatch` database
2. You should see the following tables:
   - `users`
   - `temperature_readings`
   - `humidity_readings`
   - `soil_moisture_readings`

### Default Admin Account

After importing the schema, a default admin account is created:
- **Email:** `admin@agriwatch.com`
- **Password:** `admin123`
### Default User Account
- **Email:** `user@agriwatch.com`
- **Password:** `user123`
---

## 🌐 Website Setup

### Backend Setup (PHP)

#### Step 1: Place Backend Files in XAMPP

1. Copy the entire `backend` folder to your XAMPP htdocs directory
2. The path should be: `C:\xampp\htdocs\agriwatch\backend\`

#### Step 2: Configure Database Connection

1. Open `backend/config/database.php` in a text editor
2. Update the database credentials if needed:

```php
private $host = "localhost";
private $db_name = "agriwatch";
private $username = "root";
private $password = ""; // Empty for default XAMPP setup
```

**For Production/Remote Database:**
```php
private $host = "your-database-host";
private $db_name = "agriwatch";
private $username = "your-database-username";
private $password = "your-database-password";
```

#### Step 3: Configure Email Settings (Optional but Recommended)

1. Open `backend/config/email.php`
2. Update SMTP settings with your Gmail credentials:

```php
private static $smtp_host = 'smtp.gmail.com';
private static $smtp_port = 587;
private static $smtp_username = 'your-email@gmail.com';
private static $smtp_password = 'your-app-password'; // Gmail App Password
private static $from_email = 'your-email@gmail.com';
```

**How to get Gmail App Password:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this password in `email.php`

#### Step 4: Start Apache Server

1. Open **XAMPP Control Panel**
2. Start **Apache** service
3. Verify Apache is running

#### Step 5: Test Backend API

1. Open your browser
2. Navigate to: `http://localhost/agriwatch/backend/api/device/status.php`
3. You should see a JSON response (may show "device not found" which is normal)

### Frontend Setup (Angular)

#### Step 1: Install Node.js Dependencies

1. Open **Command Prompt** or **Terminal**
2. Navigate to the frontend directory:

```bash
cd C:\xampp\htdocs\agriwatch\frontend
```

3. Install all dependencies:

```bash
npm install
```

**Note:** This may take a few minutes. Wait for the installation to complete.

#### Step 2: Configure API Endpoint

1. Open `frontend/src/app/core/auth.service.ts`
2. Update the API URL if your backend is hosted elsewhere:

```typescript
private apiUrl = 'http://localhost/agriwatch/backend/api';
```

3. Open `frontend/src/app/core/data.service.ts`
4. Update the API URL similarly:

```typescript
private apiUrl = 'http://localhost/agriwatch/backend/api';
```

**For Production:**
```typescript
private apiUrl = 'https://your-domain.com/agriwatch/backend/api';
```

#### Step 3: Start Development Server

1. In the frontend directory, run:

```bash
npm start
```

2. Wait for the compilation to complete (may take 30-60 seconds)
3. The Angular app will open automatically at: `http://localhost:4200`

**Alternative Command:**
```bash
ng serve
```

#### Step 4: Build for Production (Optional)

When ready to deploy:

```bash
npm run build
```

The built files will be in `frontend/dist/AgriWatch/browser/`
Copy these files to your web server.

---

## 🔌 IoT Device Setup

### Step 1: Install Arduino IDE

1. Download and install **Arduino IDE** from [arduino.cc](https://www.arduino.cc/en/software)
2. Launch Arduino IDE

### Step 2: Install ESP8266 Board Support

1. In Arduino IDE, go to **File → Preferences**
2. In **Additional Board Manager URLs**, add:
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
3. Click **OK**

4. Go to **Tools → Board → Boards Manager**
5. Search for **"ESP8266"**
6. Install **"esp8266 by ESP8266 Community"**
7. Wait for installation to complete

### Step 3: Install Required Libraries

1. Go to **Sketch → Include Library → Manage Libraries**
2. Search and install:
   - **"DHT sensor library"** by Adafruit
   - **"Adafruit Unified Sensor"** (dependency - install this first)

### Step 4: Open Arduino Sketch

1. In Arduino IDE, go to **File → Open**
2. Navigate to: `iot/esp8266/AgriWatch_ESP8266.ino`
3. Open the file

### Step 5: Configure WiFi Credentials

1. In the Arduino sketch, find these lines:

```cpp
const char* WIFI_SSID = "ASHBORN";
const char* WIFI_PASSWORD = "cnfr2744";
```

2. Replace with your WiFi network credentials:

```cpp
const char* WIFI_SSID = "Your-WiFi-Name";
const char* WIFI_PASSWORD = "Your-WiFi-Password";
```

### Step 6: Configure Server Settings

1. Find the server configuration section:

```cpp
String SERVER_IP = ""; // Will be discovered dynamically
const int SERVER_PORT = 80;
const char* API_PATH = "/agriwatch/backend/api/device/upload.php";
```

2. **Option A: Dynamic IP Discovery** (Recommended)
   - Keep `SERVER_IP = ""` empty
   - The device will automatically discover the server IP

3. **Option B: Static IP** (Alternative)
   - Set your server's IP address:
   ```cpp
   String SERVER_IP = "192.168.1.100"; // Your server IP
   ```

### Step 7: Hardware Connections

Connect your sensors to ESP8266:

**DHT11 Sensor:**
- **VCC** → **3.3V** on ESP8266
- **GND** → **GND** on ESP8266
- **DATA** → **GPIO 2 (D4)** on ESP8266

**Soil Moisture Sensor:**
- **VCC** → **3.3V** on ESP8266
- **GND** → **GND** on ESP8266
- **A0** → **A0** pin on ESP8266

### Step 8: Select Board and Port

1. Connect ESP8266 to your computer via USB
2. In Arduino IDE, go to **Tools → Board → ESP8266 Boards → NodeMCU 1.0**
3. Go to **Tools → Port → Select your COM port** (e.g., COM3, COM4)
4. If you don't see the port, install USB drivers for your ESP8266 board

### Step 9: Upload Code

1. Click the **Upload** button (→ arrow icon) in Arduino IDE
2. Wait for compilation and upload to complete
3. You should see "Done uploading" when finished

### Step 10: Monitor Device

1. Click the **Serial Monitor** icon (magnifying glass) in Arduino IDE
2. Set baud rate to **115200** (bottom right of Serial Monitor)
3. You should see output like:

```
=== AgriWatch ESP8266 ===
Connecting to WiFi...
WiFi connected! IP: 192.168.1.50
Discovering server...
Server found: 192.168.1.100
System ready!

--- Reading Sensors ---
Temperature: 25.50°C
Humidity: 60.00%
Soil Moisture: 45.00%
Sending to server...
HTTP Response: 200
✅ Data sent successfully!
```

---

## ⚙️ Configuration

### Important Configuration Files

1. **Database Configuration:**
   - File: `backend/config/database.php`
   - Update host, database name, username, password

2. **Email Configuration:**
   - File: `backend/config/email.php`
   - Update SMTP settings for email notifications

3. **CORS Configuration:**
   - File: `backend/config/cors.php`
   - Update allowed origins for production

4. **API URLs in Frontend:**
   - Files: `frontend/src/app/core/auth.service.ts`
   - Files: `frontend/src/app/core/data.service.ts`
   - Update `apiUrl` to match your backend location

---

## ✅ Testing & Verification
open a new terminal and type:
cd frontend
ng serve

### Test 1: Database Connection

1. Open: `http://localhost/agriwatch/backend/api/device/status.php`
2. Should return JSON (even if device not found)

### Test 2: Backend API

1. Open: `http://localhost/phpmyadmin`
2. Check if data is being inserted in sensor tables
3. Verify admin user exists: `admin@agriwatch.com`

### Test 3: Frontend Application

1. Open: `http://localhost:4200`
2. Try logging in with:
   - Email: `admin@agriwatch.com`
   - Password: `admin123`
3. Verify you can see the dashboard

### Test 4: IoT Device

1. Check Serial Monitor for sensor readings
2. Verify HTTP 200 responses
3. Check database for new sensor data entries
4. Data should appear every 30 seconds

### Test 5: Complete Workflow

1. **User Registration:**
   - Go to signup page
   - Create a new account
   - Verify email (check email or `backend/email_log.txt`)

2. **Sensor Data:**
   - Login to user/admin account
   - Navigate to Temperature/Humidity/Soil Moisture pages
   - Verify real-time data is displayed
   - Check historical data charts

3. **Admin Features:**
   - Login as admin
   - Test user management
   - Verify all sensor data is accessible

---

## 🔧 Troubleshooting

### Database Issues

**Problem: "Access denied for user"**
- **Solution:** Check `backend/config/database.php` credentials
- Verify MySQL is running in XAMPP
- Check if database `agriwatch` exists

**Problem: "Table doesn't exist"**
- **Solution:** Import `backend/database/schema.sql` again
- Verify all tables are created in phpMyAdmin

### Backend API Issues

**Problem: "404 Not Found"**
- **Solution:** 
  - Check Apache is running
  - Verify files are in `C:\xampp\htdocs\agriwatch\backend\`
  - Check file permissions

**Problem: "CORS error"**
- **Solution:** 
  - Check `backend/config/cors.php`
  - Verify frontend URL is in allowed origins
  - Ensure CORS headers are set

### Frontend Issues

**Problem: "Cannot find module"**
- **Solution:** 
  - Delete `node_modules` folder
  - Run `npm install` again
  - Clear npm cache: `npm cache clean --force`

**Problem: "Port 4200 already in use"**
- **Solution:**
  ```bash
  # Use different port
  ng serve --port 4201
  ```

**Problem: "API calls failing"**
- **Solution:**
  - Check API URL in `auth.service.ts` and `data.service.ts`
  - Verify backend is accessible
  - Check browser console for errors
  - Verify CORS configuration

### IoT Device Issues

**Problem: "WiFi connection failed"**
- **Solution:**
  - Verify WiFi credentials in code
  - Check WiFi signal strength
  - Ensure 2.4GHz WiFi (ESP8266 doesn't support 5GHz)

**Problem: "Server not found"**
- **Solution:**
  - Verify server IP address
  - Check if server is accessible from device's network
  - Test server URL in browser from computer
  - Check firewall settings

**Problem: "No sensor data"**
- **Solution:**
  - Check Serial Monitor for error messages
  - Verify sensor connections
  - Check if sensors are working
  - Test sensors individually

**Problem: "Compilation errors"**
- **Solution:**
  - Verify ESP8266 board is selected
  - Install missing libraries
  - Check Arduino IDE version compatibility
  - Restart Arduino IDE

### Email Issues

**Problem: "Emails not sending"**
- **Solution:**
  - Check `backend/config/email.php` SMTP settings
  - Verify Gmail App Password is correct
  - Check `backend/email_log.txt` for logged emails
  - Ensure 2-Factor Authentication is enabled on Gmail

---

## 📚 Additional Resources

- **Project Documentation:** See `docs/` folder for detailed guides
- **API Documentation:** Check `backend/api/` for endpoint details
- **Database Schema:** See `backend/database/schema.sql`
- **Setup Guides:** 
  - `docs/SETUP_GUIDE.md`
  - `docs/DEMO_GUIDE.md`
  - `docs/ESP8266_SETUP_GUIDE.md`

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update database credentials for production
- [ ] Configure production API URLs in frontend
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure production email settings
- [ ] Update CORS settings for production domain
- [ ] Build frontend for production (`npm run build`)
- [ ] Test all functionality on production server
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review documentation in `docs/` folder
3. Check browser console for frontend errors
4. Check PHP error logs for backend issues
5. Monitor Serial Monitor for device issues
6. Review `backend/email_log.txt` for email debugging

---

**Good luck with your AgriWatch setup! 🌱**

If you encounter any issues not covered in this manual, please check the project documentation or create an issue on GitHub.