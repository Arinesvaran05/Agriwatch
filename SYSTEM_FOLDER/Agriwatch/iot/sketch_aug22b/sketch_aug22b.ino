#include <DHT.h>

// Define sensor pin for soil moisture sensor and DHT sensor
const int sensor_pin = A0;  // Soil moisture sensor pin
#define DHTPIN 2              // Pin connected to DHT sensor
#define DHTTYPE DHT11         // Define DHT type

DHT dht(DHTPIN, DHTTYPE);     // Create DHT object

void setup() {
  Serial.begin(9600);  // Start the Serial communication
  dht.begin();         // Initialize the DHT sensor
}

void loop() {
  // Read soil moisture percentage
  float moisture_percentage = (100.00 - ((analogRead(sensor_pin) / 1023.00) * 100.00));

  // Print soil moisture percentage
  Serial.print("Soil Moisture(in Percentage) = ");
  Serial.print(moisture_percentage);
  Serial.println("%");

  // Read temperature and humidity from DHT sensor
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print temperature and humidity values
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.println(" °C");

  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.println(" %");

  delay(1000);  // Wait for a second before the next reading
}