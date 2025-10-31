import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SensorData {
  id: number;
  value: number;
  timestamp: string;
  sensor_type: 'humidity' | 'temperature' | 'soil_moisture';
}

export interface SensorLog {
  id: number;
  value: number;
  timestamp: string;
  sensor_type: 'humidity' | 'temperature' | 'soil_moisture';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost/agriwatch/api';

  constructor(private http: HttpClient) {}

  // Current sensor readings
  getCurrentHumidity(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/sensors/humidity/current.php`);
  }

  getCurrentTemperature(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/sensors/temperature/current.php`);
  }

  getCurrentSoilMoisture(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/sensors/soil-moisture/current.php`);
  }

  // Sensor logs
  getHumidityLog(limit: number = 100): Observable<SensorLog[]> {
    return this.http.get<SensorLog[]>(`${this.apiUrl}/sensors/humidity/log.php?limit=${limit}`);
  }

  getTemperatureLog(limit: number = 100): Observable<SensorLog[]> {
    return this.http.get<SensorLog[]>(`${this.apiUrl}/sensors/temperature/log.php?limit=${limit}`);
  }

  getSoilMoistureLog(limit: number = 100): Observable<SensorLog[]> {
    return this.http.get<SensorLog[]>(`${this.apiUrl}/sensors/soil-moisture/log.php?limit=${limit}`);
  }

  // Download logs
  downloadHumidityLog(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/sensors/humidity/download.php`, { responseType: 'blob' });
  }

  downloadTemperatureLog(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/sensors/temperature/download.php`, { responseType: 'blob' });
  }

  downloadSoilMoistureLog(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/sensors/soil-moisture/download.php`, { responseType: 'blob' });
  }

  // User management (admin only)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users.php`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/users.php?id=${id}`);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users.php`, userData);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users.php`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users.php?id=${id}`);
  }

  // Profile management
  updateProfile(profileData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update.php`, profileData);
  }

  // Device data submission (for IoT devices)
  submitHumidityData(value: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/device/humidity.php`, { value });
  }

  submitTemperatureData(value: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/device/temperature.php`, { value });
  }

  submitSoilMoistureData(value: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/device/soil-moisture.php`, { value });
  }
}
