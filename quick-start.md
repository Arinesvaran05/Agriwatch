# 🚀 AgriWatch Quick Start Guide

## ⚡ Get Started in 5 Minutes

### 1. **Start XAMPP**
- Open XAMPP Control Panel
- Click "Start" next to **Apache** and **MySQL**
- Wait for both services to show green status

### 2. **Set Up Database**
- Open browser and go to: `http://localhost/phpmyadmin`
- Click "New" → Enter database name: `agriwatch` → Click "Create"
- Click "Import" → Choose file: `database/schema.sql` → Click "Go"

### 3. **Copy API Files**
- Copy the entire `api` folder to: `C:\xampp\htdocs\agriwatch\`
- Your API should now be accessible at: `http://localhost/agriwatch/api`

### 4. **Start Angular App**
- Open terminal in your project folder
- Run: `npm start`
- Wait for compilation to complete
- Open: `http://localhost:4200`

### 5. **Login**
- **Email:** `admin@agriwatch.com`
- **Password:** `admin123`

## 🎯 What's Working Now

✅ **User Features:**
- Login/Logout
- Dashboard with real-time sensor data
- Temperature monitoring with history
- Humidity monitoring with history  
- Soil moisture monitoring with history
- Profile management
- Change password

✅ **Admin Features:**
- Admin dashboard
- All sensor data access
- User management (basic structure)

✅ **Backend:**
- Complete RESTful API
- Database with sample data
- Authentication system
- CORS configured

## 🔧 If You Get Errors

### **Angular Won't Start:**
```bash
npm install
npm start
```

### **Database Connection Error:**
- Check XAMPP is running
- Verify database name is `agriwatch`
- Check `api/config/database.php` settings

### **API Not Found:**
- Ensure API files are in `C:\xampp\htdocs\agriwatch\api\`
- Check Apache is running in XAMPP

## 📱 Test the Application

1. **Login as Admin** → See dashboard with sensor data
2. **Navigate to Temperature** → View current readings and history
3. **Try Humidity/Soil Moisture** → Same functionality
4. **Go to Profile** → Update your information
5. **Change Password** → Test password change

## 🎉 You're Ready!

Your AgriWatch agriculture monitoring system is now fully functional with:
- Beautiful, responsive UI
- Real-time sensor data
- Historical data tracking
- User authentication
- Admin management
- Complete backend API

**Happy Farming! 🌱**
