# Dynamic IP Discovery Setup Guide

## Overview
Your ESP8266 device now automatically discovers the server IP address, eliminating the need to manually update the IP when it changes.

## How It Works

### 1. **Automatic Discovery**
- ESP8266 scans the network to find the AgriWatch server
- Tests common IP addresses first (faster)
- Falls back to full subnet scan if needed
- Rediscoveres every 5 minutes to handle IP changes

### 2. **Smart Scanning**
- **Common IPs**: Tests `.1`, `.2`, `.10`, `.100`, `.170`, `.200`, `.254`
- **Full Scan**: If not found, scans entire subnet (1-254)
- **Timeout**: 2 seconds per IP test
- **Progress**: Shows scanning progress every 50 IPs

### 3. **Discovery Endpoint**
- New endpoint: `/agriwatch/api/device/discover.php`
- Returns server information and confirms connectivity
- Lightweight and fast response

## Setup Instructions

### 1. **Upload Updated Code**
```bash
# Upload the updated AgriWatch_ESP8266.ino to your ESP8266
```

### 2. **Monitor Serial Output**
```
=== AgriWatch ESP8266 ===
Connecting to WiFi...
WiFi connected! IP: 10.49.126.170

--- Discovering Server IP ---
Local IP: 10.49.126.170
Gateway: 10.49.126.231
Subnet: 255.255.255.0
Scanning network: 10.49.126.x
Testing: 10.49.126.1
Testing: 10.49.126.2
Testing: 10.49.126.10
Testing: 10.49.126.100
Testing: 10.49.126.170
✅ Server found at: 10.49.126.170
Response: {"status":"success","message":"AgriWatch Server Found",...}
System ready!
```

### 3. **Verify Data Transmission**
```
--- Reading Sensors ---
Temperature: 32.00°C
Humidity: 57.00%
Soil Moisture: 45.30%
Sending to server...
URL: http://10.49.126.170:80/agriwatch/api/device/upload.php
✅ Data sent successfully!
```

## Benefits

### ✅ **No Manual Updates**
- No need to change IP in code
- Automatic adaptation to network changes
- Works with dynamic IP addresses

### ✅ **Robust Operation**
- Handles network restarts
- Recovers from temporary disconnections
- Continuous monitoring and rediscovery

### ✅ **Fast Discovery**
- Common IPs tested first
- Quick fallback to full scan
- Progress indicators for long scans

### ✅ **Error Handling**
- Clear error messages
- Graceful degradation
- Detailed logging

## Troubleshooting

### **Server Not Found**
```
❌ Server not found on network
```
**Solutions:**
1. Check if XAMPP is running
2. Verify server is accessible from network
3. Check firewall settings
4. Ensure discovery endpoint is working

### **Slow Discovery**
- First scan may take 1-2 minutes
- Subsequent scans are faster (5 minutes apart)
- Common IPs are tested first for speed

### **Connection Issues**
- Device will retry every 30 seconds
- Automatic WiFi reconnection
- Server IP rediscovery every 5 minutes

## Network Requirements

### **Server Side**
- XAMPP running
- Apache accessible on port 80
- Discovery endpoint: `/agriwatch/api/device/discover.php`
- Upload endpoint: `/agriwatch/api/device/upload.php`

### **Device Side**
- WiFi connection to same network
- ESP8266 with updated firmware
- DHT11 and soil moisture sensors connected

## Monitoring

### **Serial Monitor**
- Real-time discovery progress
- Connection status updates
- Error messages and diagnostics
- Data transmission confirmations

### **Server Logs**
- Check XAMPP error logs
- Monitor API endpoint access
- Verify database insertions

## Next Steps

1. **Upload the updated code** to your ESP8266
2. **Monitor the serial output** for discovery progress
3. **Verify data transmission** to the database
4. **Check the website** for incoming sensor data
5. **Test IP changes** by restarting your computer

Your device will now automatically adapt to IP address changes without any manual intervention!
