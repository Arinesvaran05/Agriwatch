# 🚀 AgriWatch ESP8266 Setup Guide

## ✅ **Simple Setup Instructions**

### **Step 1: Open Arduino IDE**
1. Open Arduino IDE
2. **File → Open**
3. Navigate to: `C:\xampp\htdocs\agriwatch\`
4. Open: `AgriWatch_ESP8266.ino`

### **Step 2: Install Libraries**
1. **Tools → Manage Libraries**
2. Search and install: **"DHT sensor library"** by Adafruit
3. Install: **"Adafruit Unified Sensor"** (dependency)

### **Step 3: Select Board**
1. **Tools → Board → ESP8266 Boards → NodeMCU 1.0** (or your board)
2. **Tools → Port → Select your COM port**

### **Step 4: Upload**
1. Click **Upload** (arrow icon)
2. Wait for "Done uploading"

### **Step 5: Monitor**
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
- VCC → 3.3V
- GND → GND  
- DATA → GPIO 2 (D4)

### **Soil Moisture Sensor:**
- VCC → 3.3V
- GND → GND
- A0 → A0 pin

## 📊 **Monitor Data**
Run this command to check if data is being received:
```cmd
C:\xampp\php\php.exe monitor-device-status.php
```

## 🎯 **What This Does**
- Reads temperature, humidity, and soil moisture every 30 seconds
- Sends data to your AgriWatch server
- Automatically reconnects if WiFi drops
- Shows clear status messages in Serial Monitor

**This simple version will definitely work!** 🚀
