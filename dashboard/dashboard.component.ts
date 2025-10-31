import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService, SensorData } from '../../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🌱 AgriWatch Dashboard</h1>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="dashboard-nav">
        <a routerLink="/user/dashboard" class="nav-item active">Dashboard</a>
        <a routerLink="/user/temperature" class="nav-item">Temperature</a>
        <a routerLink="/user/humidity" class="nav-item">Humidity</a>
        <a routerLink="/user/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/user/data-visualization" class="nav-item">Data Visualization</a>
        <a routerLink="/user/profile" class="nav-item">Profile</a>
      </nav>

      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Current Readings -->
        <section class="readings-section">
          <h2>Current Sensor Readings</h2>
          <div class="readings-grid">
            <div class="reading-card temperature">
              <div class="reading-icon">🌡️</div>
              <div class="reading-content">
                <h3>Temperature</h3>
                <div class="reading-value" *ngIf="temperatureData; else tempLoading">
                  {{ temperatureData.value }}°C
                </div>
                <ng-template #tempLoading>
                  <div class="loading">Loading...</div>
                </ng-template>
                <p class="reading-time" *ngIf="temperatureData">
                  {{ temperatureData.timestamp | date:'short' }}
                </p>
              </div>
            </div>

            <div class="reading-card humidity">
              <div class="reading-icon">💧</div>
              <div class="reading-content">
                <h3>Humidity</h3>
                <div class="reading-value" *ngIf="humidityData; else humLoading">
                  {{ humidityData.value }}%
                </div>
                <ng-template #humLoading>
                  <div class="loading">Loading...</div>
                </ng-template>
                <p class="reading-time" *ngIf="humidityData">
                  {{ humidityData.timestamp | date:'short' }}
                </p>
              </div>
            </div>

            <div class="reading-card soil-moisture">
              <div class="reading-icon">🌱</div>
              <div class="reading-content">
                <h3>Soil Moisture</h3>
                <div class="reading-value" *ngIf="soilMoistureData; else soilLoading">
                  {{ soilMoistureData.value }}%
                </div>
                <ng-template #soilLoading>
                  <div class="loading">Loading...</div>
                </ng-template>
                <p class="reading-time" *ngIf="soilMoistureData">
                  {{ soilMoistureData.timestamp | date:'short' }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <div class="action-card" (click)="navigateTo('/user/temperature')">
              <div class="action-icon">📊</div>
              <h3>View Temperature Log</h3>
              <p>Check temperature history and trends</p>
            </div>
            <div class="action-card" (click)="navigateTo('/user/humidity')">
              <div class="action-icon">📈</div>
              <h3>View Humidity Log</h3>
              <p>Monitor humidity patterns over time</p>
            </div>
            <div class="action-card" (click)="navigateTo('/user/soil-moisture')">
              <div class="action-icon">📋</div>
              <h3>View Soil Moisture Log</h3>
              <p>Track soil moisture levels</p>
            </div>
            <div class="action-card" (click)="navigateTo('/user/data-visualization')">
              <div class="action-icon">📊</div>
              <h3>Data Visualization</h3>
              <p>Live charts and analytics</p>
            </div>
            <div class="action-card" (click)="navigateTo('/user/profile')">
              <div class="action-icon">👤</div>
              <h3>Manage Profile</h3>
              <p>Update your account information</p>
            </div>
          </div>
        </section>

        <!-- Status Indicators -->
        <section class="status-section">
          <h2>System Status</h2>
          <div class="status-grid">
            <div class="status-card">
              <div class="status-indicator" [class]="getTemperatureStatus().class"></div>
              <div class="status-content">
                <h3>Temperature Sensor</h3>
                <p>{{ getTemperatureStatus().text }}</p>
                <small *ngIf="temperatureData">{{ getTimeAgo(temperatureData.timestamp) }}</small>
              </div>
            </div>
            <div class="status-card">
              <div class="status-indicator" [class]="getHumidityStatus().class"></div>
              <div class="status-content">
                <h3>Humidity Sensor</h3>
                <p>{{ getHumidityStatus().text }}</p>
                <small *ngIf="humidityData">{{ getTimeAgo(humidityData.timestamp) }}</small>
              </div>
            </div>
            <div class="status-card">
              <div class="status-indicator" [class]="getSoilMoistureStatus().class"></div>
              <div class="status-content">
                <h3>Soil Moisture Sensor</h3>
                <p>{{ getSoilMoistureStatus().text }}</p>
                <small *ngIf="soilMoistureData">{{ getTimeAgo(soilMoistureData.timestamp) }}</small>
              </div>
            </div>
            <div class="status-card">
              <div class="status-indicator" [class]="getDatabaseStatus().class"></div>
              <div class="status-content">
                <h3>Database</h3>
                <p>{{ getDatabaseStatus().text }}</p>
                <small>{{ getDatabaseStatus().details }}</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
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

    .readings-section, .actions-section, .status-section {
      margin-bottom: 40px;
    }

    .readings-section h2, .actions-section h2, .status-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .readings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .reading-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.3s ease;
    }

    .reading-card:hover {
      transform: translateY(-5px);
    }

    .reading-icon {
      font-size: 2.5rem;
      width: 60px;
      text-align: center;
    }

    .reading-content h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .reading-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }

    .reading-time {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0;
    }

    .loading {
      color: #7f8c8d;
      font-style: italic;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }

    .action-card h3 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }

    .action-card p {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .status-card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .status-indicator.online {
      background: #27ae60;
    }

    .status-indicator.offline {
      background: #e74c3c;
    }


    .status-content h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .status-content p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .readings-grid, .actions-grid, .status-grid {
        grid-template-columns: 1fr;
      }

      .nav-item {
        padding: 10px 15px;
        font-size: 0.9rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  temperatureData: SensorData | null = null;
  humidityData: SensorData | null = null;
  soilMoistureData: SensorData | null = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.loadSensorData();
    // Refresh data every 30 seconds
    setInterval(() => {
      this.loadSensorData();
    }, 30000);
  }

  loadSensorData() {
    this.dataService.getCurrentTemperature().subscribe({
      next: (data) => this.temperatureData = data,
      error: (error) => console.error('Error loading temperature data:', error)
    });

    this.dataService.getCurrentHumidity().subscribe({
      next: (data) => this.humidityData = data,
      error: (error) => console.error('Error loading humidity data:', error)
    });

    this.dataService.getCurrentSoilMoisture().subscribe({
      next: (data) => this.soilMoistureData = data,
      error: (error) => console.error('Error loading soil moisture data:', error)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getTemperatureStatus() {
    if (!this.temperatureData) {
      return { class: 'offline', text: 'Offline' };
    }
    
    const now = new Date();
    const dataTime = new Date(this.temperatureData!.timestamp);
    const minutesAgo = (now.getTime() - dataTime.getTime()) / (1000 * 60);
    
    if (minutesAgo <= 2) {
      return { class: 'online', text: 'Online' };
    } else {
      return { class: 'offline', text: 'Offline' };
    }
  }

  getHumidityStatus() {
    if (!this.humidityData) {
      return { class: 'offline', text: 'Offline' };
    }
    
    const now = new Date();
    const dataTime = new Date(this.humidityData!.timestamp);
    const minutesAgo = (now.getTime() - dataTime.getTime()) / (1000 * 60);
    
    if (minutesAgo <= 2) {
      return { class: 'online', text: 'Online' };
    } else {
      return { class: 'offline', text: 'Offline' };
    }
  }

  getSoilMoistureStatus() {
    if (!this.soilMoistureData) {
      return { class: 'offline', text: 'Offline' };
    }
    
    const now = new Date();
    const dataTime = new Date(this.soilMoistureData!.timestamp);
    const minutesAgo = (now.getTime() - dataTime.getTime()) / (1000 * 60);
    
    if (minutesAgo <= 2) {
      return { class: 'online', text: 'Online' };
    } else {
      return { class: 'offline', text: 'Offline' };
    }
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const dataTime = new Date(timestamp);
    const minutesAgo = Math.floor((now.getTime() - dataTime.getTime()) / (1000 * 60));
    
    if (minutesAgo < 1) {
      return 'Just now';
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    }
  }

  getDatabaseStatus() {
    // Check if any sensor data is available to determine database connectivity
    const hasData = this.temperatureData || this.humidityData || this.soilMoistureData;
    
    if (hasData) {
      return { 
        class: 'online', 
        text: 'Connected', 
        details: 'Database is accessible' 
      };
    } else {
      return { 
        class: 'offline', 
        text: 'Disconnected', 
        details: 'Cannot connect to database' 
      };
    }
  }
}
