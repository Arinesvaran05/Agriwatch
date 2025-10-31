import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  is_email_verified: boolean;
  created_at: string;
}

export interface DeviceStatus {
  status: string;
  timestamp: string;
  data: {
    devices: any[];
    latest_readings: any[];
    chart_data: {
      temperature: any[];
      humidity: any[];
      soil_moisture: any[];
    };
    alerts: any[];
  };
}

export interface UsersResponse {
  users: User[];
  timestamp: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost/agriwatch/backend/api';

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
    const v = Date.now();
    return this.http
      .get<any>(`${this.apiUrl}/sensors/humidity/log.php?limit=${limit}&v=${v}`)
      .pipe(
        map((resp) => Array.isArray(resp) ? resp as SensorLog[] : (resp?.data ?? []))
      );
  }

  getTemperatureLog(limit: number = 100): Observable<SensorLog[]> {
    const v = Date.now();
    return this.http
      .get<any>(`${this.apiUrl}/sensors/temperature/log.php?limit=${limit}&v=${v}`)
      .pipe(
        map((resp) => Array.isArray(resp) ? resp as SensorLog[] : (resp?.data ?? []))
      );
  }

  getSoilMoistureLog(limit: number = 100): Observable<SensorLog[]> {
    const v = Date.now();
    return this.http
      .get<any>(`${this.apiUrl}/sensors/soil-moisture/log.php?limit=${limit}&v=${v}`)
      .pipe(
        map((resp) => Array.isArray(resp) ? resp as SensorLog[] : (resp?.data ?? []))
      );
  }

  // Download logs
  downloadHumidityLog(limit: number = 100): Observable<Blob> {
    const capped = Math.min(Math.max(limit, 1), 200);
    return this.http.get(`${this.apiUrl}/sensors/humidity/download.php?limit=${capped}`, { responseType: 'blob' });
  }

  downloadTemperatureLog(limit: number = 100): Observable<Blob> {
    const capped = Math.min(Math.max(limit, 1), 200);
    return this.http.get(`${this.apiUrl}/sensors/temperature/download.php?limit=${capped}`, { responseType: 'blob' });
  }

  downloadSoilMoistureLog(limit: number = 100): Observable<Blob> {
    const capped = Math.min(Math.max(limit, 1), 200);
    return this.http.get(`${this.apiUrl}/sensors/soil-moisture/download.php?limit=${capped}`, { responseType: 'blob' });
  }

  // User management (admin only)
  getUsers(): Observable<User[] | UsersResponse> {
    const timestamp = new Date().getTime();
    return this.http.get<User[] | UsersResponse>(`${this.apiUrl}/admin/users.php?v=${timestamp}`);
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

  // IoT Device Status
  getDeviceStatus(): Observable<DeviceStatus> {
    return this.http.get<DeviceStatus>(`${this.apiUrl}/device/status.php`);
  }
}
