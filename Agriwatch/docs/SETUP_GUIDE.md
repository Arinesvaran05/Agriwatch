# 🚀 AgriWatch ESP8266 Setup Guide

## ✅ **Complete Setup Instructions**

### **Step 1: Open Arduino IDE**
1. Open Arduino IDE
2. **File → Open**
3. Navigate to: `C:\xampp\htdocs\agriwatch\`
4. Open: `AgriWatch_ESP8266.ino`

### **Step 2: Install Required Libraries**
1. **Tools → Manage Libraries**
2. Search and install: **"DHT sensor library"** by Adafruit
3. Install: **"Adafruit Unified Sensor"** (dependency)

### **Step 3: Select Board and Port**
1. **Tools → Board → ESP8266 Boards → NodeMCU 1.0** (or your board)
2. **Tools → Port → Select your COM port**

### **Step 4: Upload Code**
1. Click **Upload** (arrow icon)
2. Wait for "Done uploading"

### **Step 5: Monitor Device**
1. Open **Serial Monitor** (115200 baud)
2. You should see:
   ```
   === AgriWatch ESP8266 ===
   WiFi connected! IP: 192.168.x.x
   System ready!
   
   --- Reading Sensors ---
   Temperature: 25.50°C
   Humidity: 60.00%
   Soil Moisture: 45.00%
   Sending to server...
   HTTP Response: 200
   ✅ Data sent successfully!
   ```

## 🔧 **Hardware Connections**

### **DHT11 Sensor:**
- **VCC** → 3.3V
- **GND** → GND  
- **DATA** → GPIO 2 (D4)

### **Soil Moisture Sensor:**
- **VCC** → 3.3V
- **GND** → GND
- **A0** → A0 pin

## 📊 **Monitor Your Data**

### **Check Device Status:**
```cmd
C:\xampp\php\php.exe monitor-device-status.php
```

### **Expected Output:**
```
=== AgriWatch Device Monitor ===
Device Status: ✅ ONLINE
Message: Data received 0 minutes ago
Latest Reading: temperature = 25.50
```

## 🎯 **What This Does**
- ✅ Reads temperature, humidity, and soil moisture every 30 seconds
- ✅ Sends data to your AgriWatch server automatically
- ✅ Automatically reconnects if WiFi drops
- ✅ Shows clear status messages in Serial Monitor
- ✅ Handles sensor errors gracefully

## 🚨 **Troubleshooting**

### **If compilation fails:**
1. Check board selection (Tools → Board)
2. Install missing libraries (Tools → Manage Libraries)
3. Check COM port (Tools → Port)

### **If WiFi connection fails:**
1. Check WiFi credentials in code (lines 9-10)
2. Verify router is working
3. Check if other devices can connect

### **If server not found:**
1. Check XAMPP is running (Apache + MySQL)
2. Test server: `http://10.176.225.170/agriwatch/api/device/status.php`
3. Check firewall settings

### **If no data in database:**
1. Check Serial Monitor for error messages
2. Verify server is accessible
3. Check database connection

## 🎉 **Success Indicators**
- ✅ Code compiles without errors
- ✅ Uploads to ESP8266 successfully
- ✅ Serial Monitor shows sensor readings
- ✅ HTTP 200 responses in Serial Monitor
- ✅ Data appears in database every 30 seconds

**This simple version will definitely work!** 🚀
