# 🌱 AgriWatch ESP8266 NodeMCU Setup Guide

This guide will help you set up your ESP8266 NodeMCU with sensors to connect to the AgriWatch IoT system.

## 📋 Hardware Requirements

### Required Components:
- **ESP8266 NodeMCU** (or ESP8266 development board)
- **DHT22 sensor** (temperature & humidity)
- **Soil moisture sensor** (analog)
- **Breadboard**
- **Jumper wires**
- **Micro USB cable**
- **Power supply** (3.3V or USB power)

### Optional Components:
- **Relay module** (for controlling irrigation)
- **LED indicators** (for status display)
- **Battery pack** (for portable operation)
- **Enclosure** (for outdoor protection)

## 🔌 Pin Connections

### DHT22 Sensor:
```
DHT22 Pin  →  ESP8266 Pin
VCC        →  3.3V
GND        →  GND
DATA       →  D4 (GPIO2)
```

### Soil Moisture Sensor:
```
Soil Sensor Pin  →  ESP8266 Pin
VCC             →  3.3V
GND             →  GND
SIG (Analog)    →  A0
```

### Complete Wiring Diagram:
```
ESP8266 NodeMCU    DHT22 Sensor    Soil Moisture Sensor
┌─────────────┐    ┌─────────┐     ┌─────────────┐
│ 3.3V       │────│ VCC     │     │ VCC         │
│ GND         │────│ GND     │─────│ GND         │
│ D4 (GPIO2)  │────│ DATA    │     │             │
│ A0          │    │         │─────│ SIG (Analog)│
└─────────────┘    └─────────┘     └─────────────┘
```

## 📚 Required Libraries

Install these libraries in Arduino IDE:

1. **ESP8266WiFi** (built-in with ESP8266 board package)
2. **ESP8266HTTPClient** (built-in with ESP8266 board package)
3. **DHT sensor library** by Adafruit
4. **ArduinoJson** by Benoit Blanchon

### Installing Libraries:
1. Open Arduino IDE
2. Go to **Tools** → **Manage Libraries**
3. Search and install each library

## ⚙️ Configuration

### 1. WiFi Settings
Edit the ESP8266_AgriWatch.ino file:
```cpp
// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";           // Your WiFi network name
const char* password = "YOUR_WIFI_PASSWORD";    // Your WiFi password
```

### 2. Server Settings
```cpp
// AgriWatch Server Configuration
const char* serverHost = "192.168.1.100";       // Your computer's IP address
const int serverPort = 80;                      // HTTP port (usually 80)
const char* serverPath = "/agriwatch/api/device/"; // API path
```

### 3. Device Configuration
```cpp
// Device Configuration
const char* deviceId = "ESP8266_001";           // Unique device identifier
const int readingInterval = 30000;              // Send data every 30 seconds
```

### 4. Sensor Calibration
```cpp
// Soil moisture calibration values
int dryValue = 1023;    // Value when sensor is dry (in air)
int wetValue = 300;     // Value when sensor is wet (in water)
```

## 🔧 Setup Steps

### Step 1: Hardware Assembly
1. Connect DHT22 sensor to ESP8266
2. Connect soil moisture sensor to ESP8266
3. Double-check all connections
4. Power up the ESP8266

### Step 2: Arduino IDE Setup
1. Open Arduino IDE
2. Select board: **Tools** → **Board** → **ESP8266 Boards** → **NodeMCU 1.0**
3. Select port: **Tools** → **Port** → **COM[X]** (Windows) or **/dev/ttyUSB[X]** (Linux/Mac)
4. Set upload speed: **Tools** → **Upload Speed** → **115200**

### Step 3: Code Upload
1. Open `ESP8266_AgriWatch.ino` in Arduino IDE
2. Update WiFi credentials and server settings
3. Click **Upload** button
4. Wait for upload to complete

### Step 4: Testing
1. Open **Serial Monitor** (Tools → Serial Monitor)
2. Set baud rate to **115200**
3. Reset ESP8266 if needed
4. Check for successful WiFi connection
5. Verify sensor readings are displayed

## 🌐 Network Configuration

### Find Your Computer's IP Address:

#### Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.

#### macOS/Linux:
```bash
ifconfig
# or
ip addr show
```

### Port Forwarding (if needed):
If your ESP8266 is on a different network:
1. Configure port forwarding on your router
2. Forward port 80 to your computer's IP
3. Use your router's public IP in the code

## 📊 Testing the Connection

### 1. Serial Monitor Output:
```
=== AgriWatch ESP8266 Sensor Node ===
Connecting to WiFi: YOUR_WIFI_SSID
WiFi connected!
IP address: 192.168.1.XXX
Signal strength: -45
Setup complete!

--- Taking Sensor Reading ---
Temperature: 25.50°C
Humidity: 65.20%
Soil Moisture Raw: 456
Soil Moisture: 47.80%
Sending data to server:
{"device_id":"ESP8266_001","timestamp":"12345",...}
HTTP Response code: 200
Response: {"message":"Data received successfully",...}
Data sent successfully!
```

### 2. Check Database:
- Open AgriWatch website
- Go to IoT Dashboard
- Verify device appears online
- Check sensor readings are updated

## 🚨 Troubleshooting

### Common Issues:

#### 1. WiFi Connection Failed
- Check WiFi credentials
- Ensure ESP8266 is in range
- Verify WiFi network is 2.4GHz (ESP8266 doesn't support 5GHz)

#### 2. Sensor Reading Errors
- Check wiring connections
- Verify sensor power supply
- Calibrate soil moisture sensor

#### 3. HTTP Request Failed
- Check server IP address
- Verify XAMPP is running
- Check firewall settings
- Ensure database is accessible

#### 4. Compilation Errors
- Install required libraries
- Select correct board type
- Check Arduino IDE version compatibility

### Debug Commands:
```cpp
// Add these to your code for debugging
Serial.printf("WiFi RSSI: %d\n", WiFi.RSSI());
Serial.printf("Free heap: %d\n", ESP.getFreeHeap());
Serial.printf("Chip ID: %06X\n", ESP.getChipId());
```

## 🔄 Advanced Features

### 1. Deep Sleep Mode (Battery Operation):
```cpp
// Uncomment to enable deep sleep
// #define ENABLE_DEEP_SLEEP

#ifdef ENABLE_DEEP_SLEEP
void enterDeepSleep() {
  Serial.println("Entering deep sleep mode...");
  ESP.deepSleep(readingInterval * 1000);
}
#endif
```

### 2. NTP Time Synchronization:
```cpp
#include <NTPClient.h>
#include <WiFiUdp.h>

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void syncTime() {
  timeClient.begin();
  timeClient.setTimeOffset(0); // Set your timezone offset
  timeClient.update();
}
```

### 3. Multiple Sensors:
```cpp
// Add more DHT22 sensors
#define DHTPIN2 D5
DHT dht2(DHTPIN2, DHTTYPE);

// Add more soil moisture sensors
#define SOIL_MOISTURE_PIN2 A1
```

## 📱 Mobile App Integration

### 1. Real-time Monitoring:
- Use AgriWatch web dashboard
- Monitor sensor data remotely
- Set up email/SMS alerts

### 2. Data Export:
- Download sensor logs as CSV
- Generate reports
- Analyze trends

## 🔒 Security Considerations

### 1. Network Security:
- Use WPA2/WPA3 WiFi encryption
- Consider VPN for remote access
- Regular firmware updates

### 2. Data Privacy:
- Secure API endpoints
- User authentication
- Data encryption (HTTPS)

## 📈 Performance Optimization

### 1. Reading Intervals:
- Temperature/Humidity: Every 30-60 seconds
- Soil Moisture: Every 5-15 minutes
- Adjust based on your needs

### 2. Power Management:
- Use deep sleep for battery operation
- Optimize WiFi connection time
- Consider solar power for outdoor use

## 🆘 Support

### Getting Help:
1. Check serial monitor output
2. Verify all connections
3. Test individual components
4. Check AgriWatch server logs
5. Review this guide again

### Useful Resources:
- [ESP8266 Documentation](https://docs.espressif.com/projects/esp8266-rtos-sdk/en/latest/)
- [DHT22 Datasheet](https://www.adafruit.com/product/385)
- [ArduinoJson Documentation](https://arduinojson.org/)

---

## 🎯 Quick Start Checklist

- [ ] Hardware assembled and connected
- [ ] Libraries installed in Arduino IDE
- [ ] WiFi credentials updated
- [ ] Server IP address configured
- [ ] Code uploaded successfully
- [ ] Serial monitor shows successful connection
- [ ] Sensor data appearing in database
- [ ] AgriWatch dashboard displaying data

**Happy Farming with AgriWatch! 🌾**
