import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

interface Device {
  device_id: string;
  name: string;
  description: string;
  location: string;
  status: string;
  connection_status: string;
  last_seen: string;
  temp_readings_count: number;
  humidity_readings_count: number;
  soil_readings_count: number;
}

interface SensorReading {
  sensor_type: string;
  value: number;
  timestamp: string;
  device_id: string;
  unit: string;
  location: string;
}

interface ChartData {
  sensor_type: string;
  value: number;
  timestamp: string;
  device_id: string;
}

interface Alert {
  id: number;
  device_id: string;
  sensor_type: string;
  alert_type: string;
  threshold_value: number;
  current_value: number;
  message: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-iot-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="iot-dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🌱 IoT Dashboard</h1>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="dashboard-nav">
        <a routerLink="/admin/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/admin/temperature" class="nav-item">Temperature</a>
        <a routerLink="/admin/humidity" class="nav-item">Humidity</a>
        <a routerLink="/admin/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/admin/users" class="nav-item">Users</a>
        <a routerLink="/admin/profile" class="nav-item">Profile</a>
        <a routerLink="/admin/iot-dashboard" class="nav-item active">IoT Dashboard</a>
      </nav>

      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Back Button -->
        <div class="back-section">
          <button (click)="goBack()" class="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        <!-- Device Status Overview -->
        <div class="status-overview">
          <h2>Device Status Overview</h2>
          <div class="status-cards">
            <div class="status-card" *ngFor="let device of devices">
              <div class="device-header">
                <h3>{{ device.name }}</h3>
                <span class="status-badge" [class]="device.connection_status">
                  {{ device.connection_status }}
                </span>
              </div>
              <div class="device-info">
                <p><strong>Location:</strong> {{ device.location }}</p>
                <p><strong>Last Seen:</strong> {{ formatTimestamp(device.last_seen) }}</p>
                <p><strong>Time Since Last Reading:</strong> {{ getTimeSinceLastReading(device.last_seen) }}</p>
                <p><strong>Readings (24h):</strong> 
                  T: {{ device.temp_readings_count }} | 
                  H: {{ device.humidity_readings_count }} | 
                  S: {{ device.soil_readings_count }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-time Sensor Readings -->
        <div class="sensor-readings">
          <h2>Real-time Sensor Readings</h2>
          <div class="readings-grid">
            <div class="reading-card" *ngFor="let reading of latestReadings">
              <div class="reading-header">
                <h3>{{ reading.sensor_type | titlecase }}</h3>
                <span class="value">{{ reading.value }}{{ reading.unit }}</span>
              </div>
              <div class="reading-details">
                <p><strong>Device:</strong> {{ reading.device_id }}</p>
                <p><strong>Location:</strong> {{ reading.location }}</p>
                <p><strong>Time:</strong> {{ formatTimestamp(reading.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <h2>Sensor Data Trends (Last 24 Hours)</h2>
          <div class="chart-container">
            <canvas #temperatureChart id="temperatureChart"></canvas>
          </div>
          <div class="chart-container">
            <canvas #humidityChart id="humidityChart"></canvas>
          </div>
          <div class="chart-container">
            <canvas #soilChart id="soilChart"></canvas>
          </div>
        </div>

        <!-- Active Alerts -->
        <div class="alerts-section" *ngIf="alerts.length > 0">
          <h2>Active Alerts</h2>
          <div class="alerts-list">
            <div class="alert-card" *ngFor="let alert of alerts" [class]="alert.alert_type">
              <div class="alert-header">
                <h4>{{ alert.sensor_type | titlecase }} Alert</h4>
                <span class="alert-type">{{ alert.alert_type }}</span>
              </div>
              <div class="alert-content">
                <p><strong>Device:</strong> {{ alert.device_id }}</p>
                <p><strong>Threshold:</strong> {{ alert.threshold_value }}</p>
                <p><strong>Current:</strong> {{ alert.current_value }}</p>
                <p><strong>Message:</strong> {{ alert.message }}</p>
                <p><strong>Time:</strong> {{ formatTimestamp(alert.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Refresh Controls -->
        <div class="refresh-controls">
          <button (click)="refreshData()" class="refresh-btn" [disabled]="isLoading">
            {{ isLoading ? 'Refreshing...' : '🔄 Refresh Data' }}
          </button>
          <div class="auto-refresh">
            <label>
              <input type="checkbox" [(ngModel)]="autoRefresh" (change)="toggleAutoRefresh()">
              Auto-refresh every 10 seconds
            </label>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .iot-dashboard-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .dashboard-nav {
      background: white;
      padding: 0 40px;
      border-bottom: 1px solid #e1e8ed;
    }

    .nav-item {
      display: inline-block;
      padding: 15px 20px;
      color: #7f8c8d;
      text-decoration: none;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .nav-item:hover, .nav-item.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .back-section {
      margin-bottom: 20px;
    }

    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: #5a6268;
    }

    .status-overview, .sensor-readings, .charts-section, .alerts-section {
      margin-bottom: 40px;
    }

    .status-overview h2, .sensor-readings h2, .charts-section h2, .alerts-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .status-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .status-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }

    .device-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .device-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.online {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.offline {
      background: #f8d7da;
      color: #721c24;
    }

    .device-info p {
      margin: 5px 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .readings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .reading-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .reading-header {
      margin-bottom: 15px;
    }

    .reading-header h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      text-transform: capitalize;
    }

    .value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .reading-details p {
      margin: 5px 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .alerts-list {
      display: grid;
      gap: 15px;
    }

    .alert-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #e74c3c;
    }

    .alert-card.high {
      border-left-color: #f39c12;
    }

    .alert-card.low {
      border-left-color: #3498db;
    }

    .alert-card.critical {
      border-left-color: #e74c3c;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .alert-header h4 {
      margin: 0;
      color: #2c3e50;
    }

    .alert-type {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      background: #f8d7da;
      color: #721c24;
    }

    .alert-content p {
      margin: 5px 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .refresh-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .refresh-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s ease;
    }

    .refresh-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .refresh-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .auto-refresh label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #7f8c8d;
      cursor: pointer;
    }

    .auto-refresh input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .status-cards, .readings-grid {
        grid-template-columns: 1fr;
      }

      .refresh-controls {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
    }
  `]
})
export class IotDashboardComponent implements OnInit, OnDestroy {
  currentUser: any;
  devices: Device[] = [];
  latestReadings: SensorReading[] = [];
  chartData: { [key: string]: ChartData[] } = {};
  alerts: Alert[] = [];
  isLoading = false;
  autoRefresh = true;
  private refreshInterval: any;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.loadData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadData() {
    this.isLoading = true;
    this.dataService.getDeviceStatus().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.devices = response.data.devices || [];
          this.latestReadings = response.data.latest_readings || [];
          this.chartData = response.data.chart_data || {};
          this.alerts = response.data.alerts || [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading device status:', error);
        this.isLoading = false;
      }
    });
  }

  refreshData() {
    this.loadData();
  }

  startAutoRefresh() {
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(() => {
        this.loadData();
      }, 10000); // 10 seconds for more responsive status updates
    }
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  toggleAutoRefresh() {
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  formatTimestamp(timestamp: string): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getTimeSinceLastReading(timestamp: string): string {
    if (!timestamp) return 'Never';
    
    const lastReading = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastReading.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  goBack() {
    // Navigate back to admin dashboard
    window.history.back();
  }

  logout() {
    this.authService.logout();
    // Navigate to login page
    window.location.href = '/login';
  }
}
