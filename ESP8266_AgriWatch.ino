/*
 * AgriWatch ESP8266 Firmware (WiFi + HTTPS optional)
 * - Reads DHT22 and analog soil moisture
 * - Posts JSON to /agriwatch/api/device/upload.php
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>

// ===== USER SETTINGS =====
const char* WIFI_SSID     = "ASHBORN";
const char* WIFI_PASSWORD = "cnfr2744";
const char* SERVER_HOST   = "10.152.219.170";   // LAN or public IP/domain
const uint16_t SERVER_PORT = 80;                // 80 for HTTP, 443 for HTTPS (not enabled here)
const char* API_PATH      = "/agriwatch/api/device/upload.php";
const char* DEVICE_ID     = "ESP8266_001";     // Unique ID per device
const char* DEVICE_API_KEY= "CHANGE_ME_SECURE_KEY"; // Must match server-side config
const uint32_t SEND_INTERVAL_MS = 30000;        // 30 seconds

// DHT and Soil moisture (updated for your wiring)
// Use GPIO number 2 (which is labeled D4 on many NodeMCU boards)
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSend = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.printf("Connecting to %s", WIFI_SSID);
  uint8_t dots = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (++dots % 40 == 0) Serial.println();
  }
  Serial.println();
  Serial.print("WiFi connected, IP: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("\n[AgriWatch ESP8266]");
  dht.begin();
  pinMode(SOIL_PIN, INPUT);
  connectWiFi();
}

float mapSoilPercent(int raw) {
  const int DRY = 1023;  // tune per sensor
  const int WET = 300;   // tune per sensor
  float pct = map(raw, DRY, WET, 0, 100);
  if (pct < 0) pct = 0; if (pct > 100) pct = 100;
  return pct;
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (millis() - lastSend >= SEND_INTERVAL_MS) {
    lastSend = millis();
    // Read DHT with retries
    float t = NAN;
    float h = NAN;
    for (int i = 0; i < 3; i++) {
      t = dht.readTemperature();
      h = dht.readHumidity();
      if (!isnan(t) && !isnan(h)) break;
      delay(1500);
    }
    int soilRaw = analogRead(SOIL_PIN);
    float soilPct = mapSoilPercent(soilRaw);
    if (isnan(t) || isnan(h)) {
      Serial.println("DHT read failed after retries; will send soil only");
    }

    // Build JSON manually (no ArduinoJson dependency)
    String payload = "{";
    payload += "\"device_id\":\"" + String(DEVICE_ID) + "\",";
    payload += "\"timestamp\":\"" + String(millis()/1000) + "\"";
    bool firstSensor = true;
    if (!isnan(t)) {
      payload += ",\"temperature\":{\"value\":" + String(t, 2) + "}";
      firstSensor = false;
    }
    if (!isnan(h)) {
      payload += (firstSensor ? "," : ",") + String("\"humidity\":{\"value\":") + String(h, 2) + "}";
      firstSensor = false;
    }
    // Soil moisture always included
    payload += (firstSensor ? "," : ",") + String("\"soil_moisture\":{\"value\":") + String(soilPct, 2) + "}";
    payload += "}";

    WiFiClient client; // For HTTPS, use WiFiClientSecure and set fingerprint/CA
    HTTPClient http;
    String url = String("http://") + SERVER_HOST + ":" + SERVER_PORT + String(API_PATH);
    Serial.printf("POST %s\n", url.c_str());
    if (http.begin(client, url)) {
      http.addHeader("Content-Type", "application/json");
      http.addHeader("X-Device-Id", DEVICE_ID);
      http.addHeader("X-Api-Key", DEVICE_API_KEY);
      int code = http.POST(payload);
      Serial.printf("HTTP %d\n", code);
      if (code > 0) Serial.println(http.getString());
      http.end();
    } else {
      Serial.println("HTTP begin() failed");
    }
  }
}


