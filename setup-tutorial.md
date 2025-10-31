# 🌱 AgriWatch Setup Tutorial

This tutorial will guide you through setting up the complete AgriWatch agriculture monitoring system.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **XAMPP** (v8.0 or higher) - [Download here](https://www.apachefriends.org/)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🗄️ Database Setup

### Step 1: Start XAMPP

1. **Open XAMPP Control Panel**
   - Windows: Search for "XAMPP" in Start menu
   - Mac: Open Applications → XAMPP → XAMPP
   - Linux: Run `sudo /opt/lampp/lampp start`

2. **Start Apache and MySQL**
   - Click "Start" next to Apache
   - Click "Start" next to MySQL
   - Wait for both services to show green status

### Step 2: Access phpMyAdmin

1. **Open phpMyAdmin**
   - Open your web browser
   - Go to: `http://localhost/phpmyadmin`

2. **Create Database**
   - Click "New" in the left sidebar
   - Enter database name: `agriwatch`
   - Click "Create"

### Step 3: Import Database Schema

1. **Import SQL File**
   - Select the `agriwatch` database from the left sidebar
   - Click the "Import" tab at the top
   - Click "Choose File" and select `database/schema.sql`
   - Click "Go" to import

2. **Verify Import**
   - You should see 4 tables created:
     - `users`
     - `temperature_readings`
     - `humidity_readings`
     - `soil_moisture_readings`
   - Sample data should be inserted automatically

## 🔧 Backend Setup

### Step 1: Copy API Files

1. **Create API Directory**
   - Navigate to your XAMPP htdocs folder:
     - Windows: `C:\xampp\htdocs\`
     - Mac: `/Applications/XAMPP/htdocs/`
     - Linux: `/opt/lampp/htdocs/`

2. **Copy API Folder**
   - Create a folder named `agriwatch`
   - Copy the entire `api` folder from your project into `C:\xampp\htdocs\agriwatch\`

### Step 2: Test Backend

1. **Test API Endpoint**
   - Open browser and go to: `http://localhost/agriwatch/api/sensors/temperature/current.php`
   - You should see JSON response with temperature data

## 🎨 Frontend Setup

### Step 1: Install Dependencies

1. **Open Terminal/Command Prompt**
   - Navigate to your project directory
   - Run: `npm install`

2. **Install Additional Dependencies**
   ```bash
   npm install @angular/material @angular/cdk @angular/animations chart.js ng2-charts
   ```

### Step 2: Start Development Server

1. **Start Angular**
   ```bash
   npm start
   ```

2. **Access Application**
   - Open browser and go to: `http://localhost:4200`
   - You should see the AgriWatch login page

## 🚀 Quick Start Scripts

### Windows Users

1. **Double-click** `start-agriwatch.bat`
2. The script will automatically:
   - Start XAMPP services
   - Start Angular development server
   - Open your browser to the application

### Linux/Mac Users

1. **Make script executable**
   ```bash
   chmod +x start-agriwatch.sh
   ```

2. **Run the script**
   ```bash
   ./start-agriwatch.sh
   ```

## 🔐 Default Login Credentials

### Admin Account
- **Email:** `admin@agriwatch.com`
- **Password:** `admin123`

### Test User Account
- You can create new accounts using the signup feature
- Email verification is simulated (no actual emails sent)

## 📊 Testing the Application

### 1. Login as Admin
- Go to `http://localhost:4200`
- Login with admin credentials
- You'll be redirected to admin dashboard

### 2. Test Sensor Data
- Navigate to Temperature, Humidity, or Soil Moisture pages
- View current readings and historical data
- Test download functionality

### 3. Test User Management (Admin Only)
- Go to Users section
- View, edit, or delete user accounts

### 4. Test Device Integration
- Use API endpoints to submit sensor data:
  ```bash
  curl -X POST http://localhost/agriwatch/api/device/temperature.php \
    -H "Content-Type: application/json" \
    -d '{"value": 25.5}'
  ```

## 🔧 Troubleshooting

### Common Issues

1. **XAMPP Services Won't Start**
   - Check if ports 80 and 3306 are already in use
   - Stop other web servers (IIS, Apache, etc.)
   - Run XAMPP as administrator

2. **Database Connection Error**
   - Verify MySQL is running in XAMPP
   - Check database credentials in `api/config/database.php`
   - Ensure `agriwatch` database exists

3. **Angular Won't Start**
   - Check if Node.js is installed: `node --version`
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and run `npm install` again

4. **CORS Errors**
   - Verify API files are in correct location
   - Check CORS headers in `api/config/cors.php`
   - Ensure Apache is running

### Port Conflicts

If you get port conflicts:

1. **Change Angular Port**
   ```bash
   ng serve --port 4201
   ```

2. **Change Apache Port**
   - Edit `C:\xampp\apache\conf\httpd.conf`
   - Change `Listen 80` to `Listen 8080`

## 📁 Project Structure

```
AgriWatch/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── components/     # UI components
│   │   ├── services/       # API services
│   │   └── guards/         # Route guards
├── api/                    # PHP backend
│   ├── auth/              # Authentication endpoints
│   ├── sensors/           # Sensor data endpoints
│   ├── device/            # Device integration
│   └── config/            # Database & CORS config
├── database/              # Database schema
├── start-agriwatch.bat    # Windows startup script
├── start-agriwatch.sh     # Linux/Mac startup script
└── setup-tutorial.md      # This file
```

## 🎯 Next Steps

1. **Customize the Application**
   - Modify sensor thresholds in components
   - Add new sensor types
   - Customize UI themes

2. **Deploy to Production**
   - Build Angular app: `ng build --prod`
   - Configure production database
   - Set up proper email service

3. **Add Real IoT Devices**
   - Connect actual sensors
   - Implement real-time data streaming
   - Add device authentication

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all files are in correct locations
4. Check browser console for JavaScript errors
5. Check XAMPP error logs

---

**Happy Farming! 🌱**
