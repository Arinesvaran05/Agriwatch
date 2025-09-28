import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService, SensorData, SensorLog } from '../../../services/data.service';

@Component({
  selector: 'app-admin-temperature',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-temperature-container">
      <!-- Header -->
      <header class="admin-temperature-header">
        <div class="header-content">
          <div class="header-left">
            <button (click)="goBack()" class="back-btn">← Back</button>
            <h1>🌡️ Admin Temperature Monitoring</h1>
          </div>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="admin-temperature-nav">
        <a routerLink="/admin/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/admin/temperature" class="nav-item active">Temperature</a>
        <a routerLink="/admin/humidity" class="nav-item">Humidity</a>
        <a routerLink="/admin/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/admin/users" class="nav-item">Users</a>
        <a routerLink="/admin/data-visualization" class="nav-item">Data Visualization</a>
        <a routerLink="/admin/profile" class="nav-item">Profile</a>
      </nav>

      <!-- Main Content -->
      <main class="admin-temperature-main">
        <!-- Current Reading -->
        <section class="current-reading">
          <h2>Current Temperature</h2>
          <div class="reading-card">
            <div class="reading-icon">🌡️</div>
            <div class="reading-content">
              <div class="reading-value" *ngIf="currentTemperature; else tempLoading">
                {{ currentTemperature.value }}°C
              </div>
              <ng-template #tempLoading>
                <div class="loading">Loading...</div>
              </ng-template>
              <p class="reading-time" *ngIf="currentTemperature">
                Last updated: {{ currentTemperature.timestamp | date:'medium' }}
              </p>
            </div>
          </div>
        </section>

        <!-- Historical Data -->
        <section class="historical-data">
          <div class="section-header">
            <h2>Temperature History</h2>
            <div class="refresh-controls">
              <button (click)="manualRefresh()" class="refresh-btn" [disabled]="isRefreshing">
                <span *ngIf="!isRefreshing">🔄 Refresh</span>
                <span *ngIf="isRefreshing">⏳ Refreshing...</span>
              </button>
              <div class="last-refresh" *ngIf="lastRefreshTime">
                Last updated: {{ lastRefreshTime | date:'short' }}
              </div>
            </div>
          </div>
          <div class="data-controls">
            <button (click)="loadTemperatureLog(50)" class="control-btn">Last 50</button>
            <button (click)="loadTemperatureLog(100)" class="control-btn">Last 100</button>
            <button (click)="loadTemperatureLog(200)" class="control-btn">Last 200</button>
            <div class="download-group">
              <button (click)="downloadData(50)" class="download-btn">📥 Download 50</button>
              <button (click)="downloadData(100)" class="download-btn">📥 Download 100</button>
              <button (click)="downloadData(200)" class="download-btn">📥 Download 200</button>
            </div>
          </div>
          
          <div class="data-table">
            <table style="text-align: center;">
              <thead>
                <tr>
                  <th style="text-align: center !important;">Timestamp</th>
                  <th style="text-align: center !important;">Temperature (°C)</th>
                  <th style="text-align: center !important;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let reading of temperatureLog" [class.high]="reading.value > 30" [class.low]="reading.value < 15">
                  <td style="text-align: center !important;">{{ reading.timestamp | date:'medium' }}</td>
                  <td style="text-align: center !important;">{{ reading.value }}°C</td>
                  <td style="text-align: center !important;">
                    <span class="status" [class.normal]="reading.value >= 15 && reading.value <= 30" 
                          [class.warning]="reading.value > 30 || reading.value < 15">
                      {{ getStatus(reading.value) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Statistics -->
        <section class="statistics">
          <h2>Temperature Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Average</h3>
              <div class="stat-value">{{ getAverageTemperature() }}°C</div>
            </div>
            <div class="stat-card">
              <h3>Maximum</h3>
              <div class="stat-value">{{ getMaxTemperature() }}°C</div>
            </div>
            <div class="stat-card">
              <h3>Minimum</h3>
              <div class="stat-value">{{ getMinTemperature() }}°C</div>
            </div>
            <div class="stat-card">
              <h3>Range</h3>
              <div class="stat-value">{{ getTemperatureRange() }}°C</div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button (click)="goToDashboard()" class="action-btn">🏠 Dashboard</button>
            <button (click)="goToHumidity()" class="action-btn">💧 Humidity</button>
            <button (click)="goToSoilMoisture()" class="action-btn">🌱 Soil Moisture</button>
            <button (click)="goToUsers()" class="action-btn">👥 Manage Users</button>
            <button (click)="goToDataVisualization()" class="action-btn">📊 Data Visualization</button>
            <button (click)="goToProfile()" class="action-btn">👤 Profile</button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-temperature-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .admin-temperature-header {
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
      font-size: 1rem;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
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

    .admin-temperature-nav {
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

    .admin-temperature-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .current-reading, .historical-data, .statistics, .quick-actions {
      margin-bottom: 40px;
    }

    .current-reading h2, .historical-data h2, .statistics h2, .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .refresh-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .refresh-btn {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .refresh-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
    }

    .refresh-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
    }

    .last-refresh {
      color: #6c757d;
      font-size: 0.85rem;
      font-style: italic;
    }

    .reading-card {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .reading-icon {
      font-size: 3rem;
    }

    .reading-value {
      font-size: 3rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }

    .reading-time {
      color: #7f8c8d;
      margin: 0;
    }

    .loading {
      color: #7f8c8d;
      font-style: italic;
    }

    .data-controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .control-btn, .download-btn {
      padding: 10px 20px;
      border: 2px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .control-btn:hover, .download-btn:hover {
      background: #667eea;
      color: white;
    }

    .data-table {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
    }

    th, td {
      padding: 15px;
      text-align: center !important;
      border-bottom: 1px solid #e1e8ed;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status.normal {
      background: #d4edda;
      color: #155724;
    }

    .status.warning {
      background: #f8d7da;
      color: #721c24;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .stat-card h3 {
      color: #7f8c8d;
      margin: 0 0 15px 0;
      font-size: 1rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .header-left {
        flex-direction: column;
        gap: 10px;
      }

      .reading-card {
        flex-direction: column;
        text-align: center;
      }

      .data-controls {
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        justify-content: center;
      }
    }
  `]
})
export class AdminTemperatureComponent implements OnInit, OnDestroy {
  currentUser: any;
  currentTemperature: SensorData | null = null;
  temperatureLog: SensorLog[] = [];
  selectedLimit = 50;
  isRefreshing = false;
  lastRefreshTime: Date | null = null;
  refreshInterval: any;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.loadCurrentTemperature();
    this.loadTemperatureLog(this.selectedLimit);
    
    // Refresh current temperature and logs every 10 seconds
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadCurrentTemperature() {
    this.dataService.getCurrentTemperature().subscribe({
      next: (data) => this.currentTemperature = data,
      error: (error) => console.error('Error loading temperature data:', error)
    });
  }

  loadTemperatureLog(limit: number) {
    this.selectedLimit = Math.min(Math.max(limit, 50), 200);
    this.dataService.getTemperatureLog(this.selectedLimit).subscribe({
      next: (data) => this.temperatureLog = data,
      error: (error) => console.error('Error loading temperature log:', error)
    });
  }

  refreshData() {
    this.isRefreshing = true;
    this.loadCurrentTemperature();
    this.loadTemperatureLog(this.selectedLimit);
    this.lastRefreshTime = new Date();
    
    // Reset refreshing state after a short delay
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }

  manualRefresh() {
    this.refreshData();
  }

  downloadData(limit: number = 100) {
    this.dataService.downloadTemperatureLog(limit).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin_temperature_log_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => console.error('Error downloading data:', error)
    });
  }

  getStatus(value: number): string {
    if (value >= 15 && value <= 30) {
      return 'Normal';
    } else if (value > 30) {
      return 'High';
    } else {
      return 'Low';
    }
  }

  getAverageTemperature(): number {
    if (this.temperatureLog.length === 0) return 0;
    const sum = this.temperatureLog.reduce((acc, reading) => acc + reading.value, 0);
    return Math.round((sum / this.temperatureLog.length) * 100) / 100;
  }

  getMaxTemperature(): number {
    if (this.temperatureLog.length === 0) return 0;
    return Math.max(...this.temperatureLog.map(reading => reading.value));
  }

  getMinTemperature(): number {
    if (this.temperatureLog.length === 0) return 0;
    return Math.min(...this.temperatureLog.map(reading => reading.value));
  }

  getTemperatureRange(): number {
    return Math.round((this.getMaxTemperature() - this.getMinTemperature()) * 100) / 100;
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  goToHumidity() {
    this.router.navigate(['/admin/humidity']);
  }

  goToSoilMoisture() {
    this.router.navigate(['/admin/soil-moisture']);
  }

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  goToProfile() {
    this.router.navigate(['/admin/profile']);
  }

  goToDataVisualization() {
    this.router.navigate(['/admin/data-visualization']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
