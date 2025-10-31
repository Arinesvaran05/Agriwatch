/*
 * AgriWatch ESP8266 Firmware
 * Reads DHT11 and soil moisture sensors
 * Sends data every 30 seconds to AgriWatch server
 * Dynamically discovers server IP address
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>

// WiFi Settings
const char* WIFI_SSID = "ASHBORN";
const char* WIFI_PASSWORD = "cnfr2744";

// Server Settings
String SERVER_IP = ""; // Will be discovered dynamically
const int SERVER_PORT = 80;
const char* API_PATH = "/agriwatch/api/device/upload.php";
const char* DEVICE_ID = "ESP8266_001";
const char* API_KEY = "CHANGE_ME_SECURE_KEY";

// Timing
const unsigned long SEND_INTERVAL = 30000; // 30 seconds
const unsigned long DISCOVERY_INTERVAL = 300000; // 5 minutes

// Sensor Pins
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0

DHT dht(DHTPIN, DHTTYPE);
unsigned long lastSend = 0;
unsigned long lastDiscovery = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== AgriWatch ESP8266 ===");
  
  // Initialize sensors
  dht.begin();
  pinMode(SOIL_PIN, INPUT);
  
  // Connect to WiFi
  connectWiFi();
  
  // Discover server IP
  discoverServerIP();
  
  Serial.println("System ready!");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    connectWiFi();
  }
  
  // Rediscover server IP every 5 minutes
  if (millis() - lastDiscovery >= DISCOVERY_INTERVAL) {
    lastDiscovery = millis();
    Serial.println("Rediscovering server IP...");
    discoverServerIP();
  }
  
  // Send data every 30 seconds (only if server IP is known)
  if (millis() - lastSend >= SEND_INTERVAL && SERVER_IP.length() > 0) {
    lastSend = millis();
    sendSensorData();
  }
  
  delay(1000); // Small delay
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("WiFi connected! IP: ");
  Serial.println(WiFi.localIP());
}

void discoverServerIP() {
  Serial.println("\n--- Discovering Server IP ---");
  
  // Get our IP and network info
  IPAddress localIP = WiFi.localIP();
  IPAddress gateway = WiFi.gatewayIP();
  IPAddress subnet = WiFi.subnetMask();
  
  Serial.printf("Local IP: %s\n", localIP.toString().c_str());
  Serial.printf("Gateway: %s\n", gateway.toString().c_str());
  Serial.printf("Subnet: %s\n", subnet.toString().c_str());
  
  // Extract network base (e.g., 10.49.126 from 10.49.126.170)
  String networkBase = localIP.toString();
  int lastDot = networkBase.lastIndexOf('.');
  networkBase = networkBase.substring(0, lastDot);
  
  Serial.printf("Scanning network: %s.x\n", networkBase.c_str());
  
  // Scan common IP ranges
  String possibleIPs[] = {
    networkBase + ".1",   // Router
    networkBase + ".2",   // Common server
    networkBase + ".10",  // Common server
    networkBase + ".100", // Common server
    networkBase + ".170", // Your current IP
    networkBase + ".200", // Common server
    networkBase + ".254"  // Common server
  };
  
  for (int i = 0; i < 7; i++) {
    String testIP = possibleIPs[i];
    Serial.printf("Testing: %s\n", testIP.c_str());
    
    if (testServerIP(testIP)) {
      SERVER_IP = testIP;
      Serial.printf("✅ Server found at: %s\n", SERVER_IP.c_str());
      return;
    }
  }
  
  // If not found in common ranges, scan the entire subnet
  Serial.println("Scanning entire subnet...");
  for (int i = 1; i <= 254; i++) {
    String testIP = networkBase + "." + String(i);
    
    if (testServerIP(testIP)) {
      SERVER_IP = testIP;
      Serial.printf("✅ Server found at: %s\n", SERVER_IP.c_str());
      return;
    }
    
    // Show progress every 50 IPs
    if (i % 50 == 0) {
      Serial.printf("Scanned %d/254 IPs...\n", i);
    }
  }
  
  Serial.println("❌ Server not found on network");
  SERVER_IP = "";
}

bool testServerIP(String ip) {
  WiFiClient client;
  HTTPClient http;
  
  String url = "http://" + ip + ":" + String(SERVER_PORT) + "/agriwatch/api/device/discover.php";
  
  if (http.begin(client, url)) {
    http.setTimeout(2000); // 2 second timeout
    int httpCode = http.GET();
    
    if (httpCode == 200) {
      String response = http.getString();
      Serial.printf("✅ Server found at %s\n", ip.c_str());
      Serial.printf("Response: %s\n", response.c_str());
      http.end();
      return true;
    }
    
    http.end();
  }
  
  return false;
}

void sendSensorData() {
  Serial.println("\n--- Reading Sensors ---");
  
  // Read DHT sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Read soil moisture sensor
  int soilRaw = analogRead(SOIL_PIN);
  float soilMoisture = mapSoilPercent(soilRaw);
  
  // Check if readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("❌ Failed to read DHT sensor");
    return;
  }
  
  Serial.printf("Temperature: %.2f°C\n", temperature);
  Serial.printf("Humidity: %.2f%%\n", humidity);
  Serial.printf("Soil Moisture: %.2f%%\n", soilMoisture);
  
  // Send to server
  sendToServer(temperature, humidity, soilMoisture);
}

void sendToServer(float temperature, float humidity, float soilMoisture) {
  if (SERVER_IP.length() == 0) {
    Serial.println("❌ Server IP not discovered");
    return;
  }
  
  WiFiClient client;
  HTTPClient http;
  
  String url = "http://" + SERVER_IP + ":" + String(SERVER_PORT) + API_PATH;
  
  Serial.println("Sending to server...");
  Serial.printf("URL: %s\n", url.c_str());
  
  if (http.begin(client, url)) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-Id", DEVICE_ID);
    http.addHeader("X-Api-Key", API_KEY);
    http.setTimeout(5000);
    
    // Create JSON payload manually
    String payload = "{";
    payload += "\"device_id\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"timestamp\":\"" + String(millis()/1000) + "\",";
    payload += "\"temperature\":{\"value\":" + String(temperature, 2) + "},";
    payload += "\"humidity\":{\"value\":" + String(humidity, 2) + "},";
    payload += "\"soil_moisture\":{\"value\":" + String(soilMoisture, 2) + "}";
    payload += "}";
    
    Serial.printf("Payload: %s\n", payload.c_str());
    
    int httpCode = http.POST(payload);
    
    if (httpCode > 0) {
      String response = http.getString();
      Serial.printf("HTTP Response: %d\n", httpCode);
      Serial.printf("Response: %s\n", response.c_str());
      
      if (httpCode == 200) {
        Serial.println("✅ Data sent successfully!");
      } else {
        Serial.println("❌ Server error");
      }
    } else {
      Serial.println("❌ Connection failed");
    }
    
    http.end();
  } else {
    Serial.println("❌ Failed to connect to server");
  }
}

float mapSoilPercent(int raw) {
  // Calibrate these values for your soil moisture sensor
  const int DRY_VALUE = 1023;
  const int WET_VALUE = 300;
  
  float percentage = map(raw, DRY_VALUE, WET_VALUE, 0, 100);
  
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  
  return percentage;
}
