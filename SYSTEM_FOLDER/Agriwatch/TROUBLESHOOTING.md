# AgriWatch Sensor Data Troubleshooting Guide 🔧

## 🚨 **Issue: Can't See Sensor Data on Website**

If you can't see sensor data on the website, follow these steps to diagnose and fix the issue:

## 🔍 **Step 1: Check XAMPP Status**

### **Make sure XAMPP is running:**
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Both should show green "Running" status

### **Test XAMPP accessibility:**
- Visit: http://localhost (should show XAMPP dashboard)
- Visit: http://localhost/agriwatch (should show project files)

## 🗄️ **Step 2: Database Setup**

### **Check if database exists:**
1. Go to http://localhost/phpmyadmin
2. Look for database named `agriwatch`
3. If it doesn't exist, create it

### **Import database schema:**
1. In phpMyAdmin, select `agriwatch` database
2. Go to "Import" tab
3. Choose file: `backend/database/schema.sql`
4. Click "Go" to import

### **Test database connection:**
- Visit: http://localhost/agriwatch/test-database.php
- This will test connection and add sample data

## 🌐 **Step 3: Test API Endpoints**

### **Test sensor data endpoints directly:**
- Temperature: http://localhost/agriwatch/backend/api/sensors/temperature/current.php
- Humidity: http://localhost/agriwatch/backend/api/sensors/humidity/current.php
- Soil Moisture: http://localhost/agriwatch/backend/api/sensors/soil-moisture/current.php

### **Expected response format:**
```json
{
    "id": 1,
    "value": 25.5,
    "timestamp": "2024-01-01 12:00:00",
    "sensor_type": "temperature"
}
```

## 🔧 **Step 4: Check Frontend-Backend Connection**

### **Open browser developer tools:**
1. Go to http://localhost:4200
2. Press F12 to open developer tools
3. Go to "Console" tab
4. Look for any error messages

### **Check Network tab:**
1. Go to "Network" tab in developer tools
2. Refresh the page
3. Look for failed API calls (red entries)
4. Check if API calls are going to correct URLs

## 📊 **Step 5: Add Sample Data**

### **If no sensor data exists, add sample data:**

1. **Via phpMyAdmin:**
   ```sql
   INSERT INTO temperature_readings (value) VALUES 
   (25.5), (26.2), (24.8), (27.1), (25.9);
   
   INSERT INTO humidity_readings (value) VALUES 
   (65.2), (68.5), (62.1), (70.3), (66.8);
   
   INSERT INTO soil_moisture_readings (value) VALUES 
   (45.2), (48.5), (42.1), (50.3), (46.8);
   ```

2. **Via test script:**
   - Visit: http://localhost/agriwatch/test-database.php
   - This will automatically add sample data

## 🔄 **Step 6: Restart Services**

### **If issues persist:**
1. Stop XAMPP services
2. Start XAMPP services again
3. Restart Angular dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm start
   ```

## 🎯 **Common Issues & Solutions**

### **Issue: "Database connection failed"**
- **Solution:** Start MySQL service in XAMPP
- **Solution:** Check database credentials in `backend/config/database.php`

### **Issue: "Table doesn't exist"**
- **Solution:** Import database schema from `backend/database/schema.sql`

### **Issue: "No data found"**
- **Solution:** Add sample data using the test script or SQL commands above

### **Issue: "CORS error"**
- **Solution:** Check `backend/config/cors.php` is properly configured

### **Issue: "API endpoint not found"**
- **Solution:** Verify file paths in `backend/api/sensors/` directory

## ✅ **Verification Checklist**

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `agriwatch` exists
- [ ] Database tables exist (users, temperature_readings, humidity_readings, soil_moisture_readings)
- [ ] Sample data exists in sensor tables
- [ ] API endpoints return JSON data
- [ ] Angular app loads without console errors
- [ ] Network tab shows successful API calls

## 🆘 **Still Having Issues?**

If you're still having problems:

1. **Check the test script:** http://localhost/agriwatch/test-database.php
2. **Check browser console** for specific error messages
3. **Verify file permissions** on backend directory
4. **Check XAMPP error logs** in XAMPP control panel

## 📞 **Quick Test Commands**

```bash
# Test database connection
php test-database.php

# Start Angular dev server
npm start

# Test API endpoint (if curl is available)
curl http://localhost/agriwatch/backend/api/sensors/temperature/current.php
```

Once all these steps are completed, you should see sensor data on the website! 🌟
