import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService, SensorData, SensorLog } from '../../../services/data.service';

@Component({
  selector: 'app-soil-moisture',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="soil-moisture-container">
      <!-- Header -->
      <header class="soil-moisture-header">
        <div class="header-content">
          <h1>🌱 Soil Moisture Monitoring</h1>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="soil-moisture-nav">
        <a routerLink="/user/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/user/temperature" class="nav-item">Temperature</a>
        <a routerLink="/user/humidity" class="nav-item">Humidity</a>
        <a routerLink="/user/soil-moisture" class="nav-item active">Soil Moisture</a>
        <a routerLink="/user/profile" class="nav-item">Profile</a>
      </nav>

      <!-- Main Content -->
      <main class="soil-moisture-main">
        <!-- Current Reading -->
        <section class="current-reading">
          <h2>Current Soil Moisture</h2>
          <div class="reading-card">
            <div class="reading-icon">🌱</div>
            <div class="reading-content">
              <div class="reading-value" *ngIf="currentSoilMoisture; else soilLoading">
                {{ currentSoilMoisture.value }}%
              </div>
              <ng-template #soilLoading>
                <div class="loading">Loading...</div>
              </ng-template>
              <p class="reading-time" *ngIf="currentSoilMoisture">
                Last updated: {{ currentSoilMoisture.timestamp | date:'medium' }}
              </p>
            </div>
          </div>
        </section>

        <!-- Historical Data -->
        <section class="historical-data">
          <h2>Soil Moisture History</h2>
          <div class="data-controls">
            <button (click)="loadSoilMoistureLog(50)" class="control-btn">Last 50</button>
            <button (click)="loadSoilMoistureLog(100)" class="control-btn">Last 100</button>
            <button (click)="loadSoilMoistureLog(200)" class="control-btn">Last 200</button>
            <div class="download-group">
              <button (click)="downloadData(50)" class="download-btn">📥 Download 50</button>
              <button (click)="downloadData(100)" class="download-btn">📥 Download 100</button>
              <button (click)="downloadData(200)" class="download-btn">📥 Download 200</button>
            </div>
          </div>
          
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Soil Moisture (%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let reading of soilMoistureLog" [class.high]="reading.value > 70" [class.low]="reading.value < 20">
                  <td>{{ reading.timestamp | date:'medium' }}</td>
                  <td>{{ reading.value }}%</td>
                  <td>
                    <span class="status" [class.normal]="reading.value >= 20 && reading.value <= 70" 
                          [class.warning]="reading.value > 70 || reading.value < 20">
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
          <h2>Soil Moisture Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Average</h3>
              <div class="stat-value">{{ getAverageSoilMoisture() }}%</div>
            </div>
            <div class="stat-card">
              <h3>Maximum</h3>
              <div class="stat-value">{{ getMaxSoilMoisture() }}%</div>
            </div>
            <div class="stat-card">
              <h3>Minimum</h3>
              <div class="stat-value">{{ getMinSoilMoisture() }}%</div>
            </div>
            <div class="stat-card">
              <h3>Range</h3>
              <div class="stat-value">{{ getSoilMoistureRange() }}%</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .soil-moisture-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .soil-moisture-header {
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

    .soil-moisture-nav {
      background: white;
      padding: 0 20px;
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

    .soil-moisture-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .current-reading, .historical-data, .statistics {
      margin-bottom: 40px;
    }

    .current-reading h2, .historical-data h2, .statistics h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
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
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 15px;
      text-align: left;
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

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
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
    }
  `]
})
export class SoilMoistureComponent implements OnInit {
  currentUser: any;
  currentSoilMoisture: SensorData | null = null;
  soilMoistureLog: SensorLog[] = [];
  selectedLimit = 50;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.loadCurrentSoilMoisture();
    this.loadSoilMoistureLog(this.selectedLimit);
    
    // Refresh current soil moisture and logs every 20 seconds
    setInterval(() => {
      this.loadCurrentSoilMoisture();
      this.loadSoilMoistureLog(this.selectedLimit);
    }, 20000);
  }

  loadCurrentSoilMoisture() {
    this.dataService.getCurrentSoilMoisture().subscribe({
      next: (data) => this.currentSoilMoisture = data,
      error: (error) => console.error('Error loading soil moisture data:', error)
    });
  }

  loadSoilMoistureLog(limit: number) {
    this.selectedLimit = Math.min(Math.max(limit, 50), 200);
    this.dataService.getSoilMoistureLog(this.selectedLimit).subscribe({
      next: (data) => this.soilMoistureLog = data,
      error: (error) => console.error('Error loading soil moisture log:', error)
    });
  }

  downloadData(limit: number = 100) {
    this.dataService.downloadSoilMoistureLog(limit).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soil_moisture_log_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => console.error('Error downloading data:', error)
    });
  }

  getStatus(value: number): string {
    if (value >= 20 && value <= 70) {
      return 'Normal';
    } else if (value > 70) {
      return 'High';
    } else {
      return 'Low';
    }
  }

  getAverageSoilMoisture(): number {
    if (this.soilMoistureLog.length === 0) return 0;
    const sum = this.soilMoistureLog.reduce((acc, reading) => acc + reading.value, 0);
    return Math.round((sum / this.soilMoistureLog.length) * 100) / 100;
  }

  getMaxSoilMoisture(): number {
    if (this.soilMoistureLog.length === 0) return 0;
    return Math.max(...this.soilMoistureLog.map(reading => reading.value));
  }

  getMinSoilMoisture(): number {
    if (this.soilMoistureLog.length === 0) return 0;
    return Math.min(...this.soilMoistureLog.map(reading => reading.value));
  }

  getSoilMoistureRange(): number {
    return Math.round((this.getMaxSoilMoisture() - this.getMinSoilMoisture()) * 100) / 100;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
