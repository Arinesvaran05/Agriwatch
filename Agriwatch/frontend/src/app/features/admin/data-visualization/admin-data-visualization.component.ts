import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { DataService, SensorData, SensorLog } from '../../../core/data.service';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-admin-data-visualization',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-data-visualization-container">
      <!-- Header -->
      <header class="admin-data-visualization-header">
        <div class="header-content">
          <div class="header-left">
            <button (click)="goBack()" class="back-btn">← Back</button>
            <h1>📊 Admin Data Visualization</h1>
          </div>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="admin-data-visualization-nav">
        <a routerLink="/admin/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/admin/temperature" class="nav-item">Temperature</a>
        <a routerLink="/admin/humidity" class="nav-item">Humidity</a>
        <a routerLink="/admin/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/admin/users" class="nav-item">Users</a>
        <a routerLink="/admin/data-visualization" class="nav-item active">Data Visualization</a>
        <a routerLink="/admin/profile" class="nav-item">Profile</a>
      </nav>

      <!-- Main Content -->
      <main class="admin-data-visualization-main">
        <!-- Current Sensor Readings -->
        <section class="current-readings">
          <h2>Current Sensor Readings</h2>
          <div class="readings-grid">
            <div class="reading-card temperature">
              <div class="reading-icon">🌡️</div>
              <div class="reading-content">
                <h3>Temperature</h3>
                <div class="reading-value">{{ currentTemperature?.value || 'N/A' }}°C</div>
                <div class="reading-time">{{ currentTemperature?.timestamp ? (currentTemperature!.timestamp | date:'medium') : 'No data' }}</div>
              </div>
            </div>
            <div class="reading-card humidity">
              <div class="reading-icon">💧</div>
              <div class="reading-content">
                <h3>Humidity</h3>
                <div class="reading-value">{{ currentHumidity?.value || 'N/A' }}%</div>
                <div class="reading-time">{{ currentHumidity?.timestamp ? (currentHumidity!.timestamp | date:'medium') : 'No data' }}</div>
              </div>
            </div>
            <div class="reading-card soil-moisture">
              <div class="reading-icon">🌱</div>
              <div class="reading-content">
                <h3>Soil Moisture</h3>
                <div class="reading-value">{{ currentSoilMoisture?.value || 'N/A' }}%</div>
                <div class="reading-time">{{ currentSoilMoisture?.timestamp ? (currentSoilMoisture!.timestamp | date:'medium') : 'No data' }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Chart Controls -->
        <section class="chart-controls">
          <h2>Chart Controls</h2>
          <div class="controls-grid">
            <div class="control-group">
              <label>Time Range:</label>
              <select [(ngModel)]="selectedTimeRange" (change)="updateCharts()">
                <option value="50">Last 50 readings</option>
                <option value="100">Last 100 readings</option>
                <option value="200">Last 200 readings</option>
              </select>
            </div>
            <div class="control-group">
              <label>Update Frequency:</label>
              <select [(ngModel)]="updateFrequency" (change)="updateRefreshInterval()">
                <option value="5000">5 seconds</option>
                <option value="10000">10 seconds</option>
                <option value="20000">20 seconds</option>
                <option value="30000">30 seconds</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
          <h2>Live Sensor Data Charts</h2>
          
          <!-- Temperature Chart -->
          <div class="chart-container">
            <h3>🌡️ Temperature Trends</h3>
            <div class="chart-wrapper">
              <canvas #temperatureChart></canvas>
            </div>
          </div>

          <!-- Humidity Chart -->
          <div class="chart-container">
            <h3>💧 Humidity Trends</h3>
            <div class="chart-wrapper">
              <canvas #humidityChart></canvas>
            </div>
          </div>

          <!-- Soil Moisture Chart -->
          <div class="chart-container">
            <h3>🌱 Soil Moisture Trends</h3>
            <div class="chart-wrapper">
              <canvas #soilMoistureChart></canvas>
            </div>
          </div>

          <!-- Combined Chart -->
          <div class="chart-container combined">
            <h3>📊 Combined Sensor Data</h3>
            <div class="chart-wrapper">
              <canvas #combinedChart></canvas>
            </div>
          </div>
        </section>

        <!-- Statistics Summary -->
        <section class="statistics-summary">
          <h2>Data Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Temperature</h3>
              <div class="stat-values">
                <div class="stat-item">
                  <span class="label">Average:</span>
                  <span class="value">{{ getAverageTemperature() }}°C</span>
                </div>
                <div class="stat-item">
                  <span class="label">Range:</span>
                  <span class="value">{{ getTemperatureRange() }}°C</span>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <h3>Humidity</h3>
              <div class="stat-values">
                <div class="stat-item">
                  <span class="label">Average:</span>
                  <span class="value">{{ getAverageHumidity() }}%</span>
                </div>
                <div class="stat-item">
                  <span class="label">Range:</span>
                  <span class="value">{{ getHumidityRange() }}%</span>
                </div>
              </div>
            </div>
            <div class="stat-card">
              <h3>Soil Moisture</h3>
              <div class="stat-values">
                <div class="stat-item">
                  <span class="label">Average:</span>
                  <span class="value">{{ getAverageSoilMoisture() }}%</span>
                </div>
                <div class="stat-item">
                  <span class="label">Range:</span>
                  <span class="value">{{ getSoilMoistureRange() }}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button (click)="goToDashboard()" class="action-btn">🏠 Dashboard</button>
            <button (click)="goToTemperature()" class="action-btn">🌡️ Temperature</button>
            <button (click)="goToHumidity()" class="action-btn">💧 Humidity</button>
            <button (click)="goToSoilMoisture()" class="action-btn">🌱 Soil Moisture</button>
            <button (click)="goToUsers()" class="action-btn">👥 Users</button>
            <button (click)="goToProfile()" class="action-btn">👤 Profile</button>
            <button (click)="toggleAutoUpdate()" class="action-btn" [class.active]="autoUpdate">
              {{ autoUpdate ? '⏸️ Pause' : '▶️ Resume' }} Auto Update
            </button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-data-visualization-container {
      min-height: calc(100vh - 200px);
      background: #f8f9fa;
      padding-bottom: 20px;
    }

    .admin-data-visualization-header {
      background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
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

    .admin-data-visualization-nav {
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
      color: #17a2b8;
      border-bottom-color: #17a2b8;
    }

    .admin-data-visualization-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .current-readings, .chart-controls, .charts-section, .statistics-summary, .quick-actions {
      margin-bottom: 40px;
    }

    .current-readings h2, .chart-controls h2, .charts-section h2, .statistics-summary h2, .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .readings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .reading-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .reading-icon {
      font-size: 2.5rem;
    }

    .reading-content h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .reading-value {
      font-size: 2rem;
      font-weight: bold;
      color: #17a2b8;
      margin-bottom: 5px;
    }

    .reading-time {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
    }

    .chart-controls {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .control-group label {
      font-weight: 600;
      color: #333;
    }

    .control-group select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }


    .chart-container {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      margin-bottom: 25px;
    }

    .chart-container h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .chart-wrapper {
      height: 400px;
      position: relative;
    }

    .chart-container.combined .chart-wrapper {
      height: 500px;
    }

    .statistics-summary {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      border-left: 4px solid #667eea;
    }

    .stat-card h3 {
      margin: 0 0 15px 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .stat-values {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-item .label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .stat-item .value {
      font-weight: bold;
      color: #2c3e50;
    }

    .quick-actions {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .action-btn.active {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }

    h1, h2 {
      margin: 0;
    }

    h1 {
      font-size: 2rem;
      font-weight: 600;
    }

    h2 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .admin-data-visualization-nav {
        padding: 15px 10px;
        gap: 15px;
      }

      .admin-data-visualization-main {
        padding: 20px 10px;
      }

      .readings-grid {
        grid-template-columns: 1fr;
      }

      .controls-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }

      .chart-wrapper {
        height: 300px;
      }

      .chart-container.combined .chart-wrapper {
        height: 400px;
      }
    }
  `]
})
export class AdminDataVisualizationComponent implements OnInit, OnDestroy {
  @ViewChild('temperatureChart', { static: false }) temperatureChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('humidityChart', { static: false }) humidityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('soilMoistureChart', { static: false }) soilMoistureChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('combinedChart', { static: false }) combinedChartRef!: ElementRef<HTMLCanvasElement>;

  currentUser: any;
  currentTemperature: SensorData | null = null;
  currentHumidity: SensorData | null = null;
  currentSoilMoisture: SensorData | null = null;
  
  temperatureLog: SensorLog[] = [];
  humidityLog: SensorLog[] = [];
  soilMoistureLog: SensorLog[] = [];
  
  selectedTimeRange = 100;
  updateFrequency = 20000;
  autoUpdate = true;
  private refreshInterval: any;
  
  // Chart instances
  private temperatureChart: Chart | null = null;
  private humidityChart: Chart | null = null;
  private soilMoistureChart: Chart | null = null;
  private combinedChart: Chart | null = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    // Add a small delay to ensure DOM elements are ready
    setTimeout(() => {
      this.initializeCharts();
      this.loadAllData();
      this.startAutoUpdate();
    }, 100);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.temperatureChart) this.temperatureChart.destroy();
    if (this.humidityChart) this.humidityChart.destroy();
    if (this.soilMoistureChart) this.soilMoistureChart.destroy();
    if (this.combinedChart) this.combinedChart.destroy();
  }

  initializeCharts() {
    try {
      console.log('Initializing admin charts...');
      console.log('Temperature chart element:', this.temperatureChartRef?.nativeElement);
      console.log('Humidity chart element:', this.humidityChartRef?.nativeElement);
      console.log('Soil moisture chart element:', this.soilMoistureChartRef?.nativeElement);
      console.log('Combined chart element:', this.combinedChartRef?.nativeElement);

      // Temperature Chart
      this.temperatureChart = new Chart(this.temperatureChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5'],
          datasets: [{
            label: 'Temperature (°C)',
            data: [25, 26, 24, 27, 25],
            borderColor: '#e7673cff',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            }
          }
        }
      });

      // Humidity Chart
      this.humidityChart = new Chart(this.humidityChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5'],
          datasets: [{
            label: 'Humidity (%)',
            data: [60, 65, 58, 62, 59],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Humidity (%)'
              }
            }
          }
        }
      });

      // Soil Moisture Chart
      this.soilMoistureChart = new Chart(this.soilMoistureChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5'],
          datasets: [{
            label: 'Soil Moisture (%)',
            data: [45, 50, 42, 48, 46],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Soil Moisture (%)'
              }
            }
          }
        }
      });

      // Combined Chart
      this.combinedChart = new Chart(this.combinedChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5'],
          datasets: [
            {
              label: 'Temperature (°C)',
              data: [25, 26, 24, 27, 25],
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderWidth: 2,
              yAxisID: 'y',
              tension: 0.4
            },
            {
              label: 'Humidity (%)',
              data: [60, 65, 58, 62, 59],
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              borderWidth: 2,
              yAxisID: 'y1',
              tension: 0.4
            },
            {
              label: 'Soil Moisture (%)',
              data: [45, 50, 42, 48, 46],
              borderColor: '#27ae60',
              backgroundColor: 'rgba(39, 174, 96, 0.1)',
              borderWidth: 2,
              yAxisID: 'y2',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Humidity (%)'
              },
              grid: {
                drawOnChartArea: false,
              },
            },
            y2: {
              type: 'linear',
              display: false,
              title: {
                display: true,
                text: 'Soil Moisture (%)'
              },
              grid: {
                drawOnChartArea: false,
              },
            }
          }
        }
      });

      console.log('Admin charts initialized successfully');
      console.log('Temperature chart:', this.temperatureChart);
      console.log('Humidity chart:', this.humidityChart);
      console.log('Soil moisture chart:', this.soilMoistureChart);
      console.log('Combined chart:', this.combinedChart);
    } catch (error) {
      console.error('Error initializing admin charts:', error);
      console.error('Error details:', error);
    }
  }

  loadAllData() {
    this.loadCurrentReadings();
    this.loadHistoricalData();
  }

  loadCurrentReadings() {
    try {
      this.dataService.getCurrentTemperature().subscribe({
        next: (data) => this.currentTemperature = data,
        error: (error) => console.error('Error loading temperature data:', error)
      });

      this.dataService.getCurrentHumidity().subscribe({
        next: (data) => this.currentHumidity = data,
        error: (error) => console.error('Error loading humidity data:', error)
      });

      this.dataService.getCurrentSoilMoisture().subscribe({
        next: (data) => this.currentSoilMoisture = data,
        error: (error) => console.error('Error loading soil moisture data:', error)
      });
    } catch (error) {
      console.error('Error loading current readings:', error);
    }
  }

  loadHistoricalData() {
    console.log('Loading admin historical data for time range:', this.selectedTimeRange);
    
    try {
      this.dataService.getTemperatureLog(this.selectedTimeRange).subscribe({
        next: (data) => {
          console.log('Admin temperature data received:', data.length, 'points');
          this.temperatureLog = data;
          this.updateTemperatureChart();
        },
        error: (error) => console.error('Error loading temperature log:', error)
      });

      this.dataService.getHumidityLog(this.selectedTimeRange).subscribe({
        next: (data) => {
          console.log('Admin humidity data received:', data.length, 'points');
          this.humidityLog = data;
          this.updateHumidityChart();
        },
        error: (error) => console.error('Error loading humidity log:', error)
      });

      this.dataService.getSoilMoistureLog(this.selectedTimeRange).subscribe({
        next: (data) => {
          console.log('Admin soil moisture data received:', data.length, 'points');
          this.soilMoistureLog = data;
          this.updateSoilMoistureChart();
          this.updateCombinedChart();
        },
        error: (error) => console.error('Error loading soil moisture log:', error)
      });
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  }

  updateCharts() {
    console.log('Updating admin charts with time range:', this.selectedTimeRange);
    // Add loading state
    this.showLoadingState();
    this.loadHistoricalData();
  }

  showLoadingState() {
    // Show loading indicators on charts
    if (this.temperatureChart) {
      this.temperatureChart.data.datasets[0].data = [];
      this.temperatureChart.update('active');
    }
    if (this.humidityChart) {
      this.humidityChart.data.datasets[0].data = [];
      this.humidityChart.update('active');
    }
    if (this.soilMoistureChart) {
      this.soilMoistureChart.data.datasets[0].data = [];
      this.soilMoistureChart.update('active');
    }
    if (this.combinedChart) {
      this.combinedChart.data.datasets.forEach(dataset => dataset.data = []);
      this.combinedChart.update('active');
    }
  }

  updateTemperatureChart() {
    if (!this.temperatureChart) {
      console.log('Admin temperature chart not initialized yet');
      return;
    }
    
    console.log('Updating admin temperature chart with', this.temperatureLog.length, 'data points');
    const labels = this.temperatureLog.map(log => new Date(log.timestamp).toLocaleTimeString());
    const data = this.temperatureLog.map(log => log.value);
    
    this.temperatureChart.data.labels = labels;
    this.temperatureChart.data.datasets[0].data = data;
    this.temperatureChart.update('active');
  }

  updateHumidityChart() {
    if (!this.humidityChart) {
      console.log('Admin humidity chart not initialized yet');
      return;
    }
    
    console.log('Updating admin humidity chart with', this.humidityLog.length, 'data points');
    const labels = this.humidityLog.map(log => new Date(log.timestamp).toLocaleTimeString());
    const data = this.humidityLog.map(log => log.value);
    
    this.humidityChart.data.labels = labels;
    this.humidityChart.data.datasets[0].data = data;
    this.humidityChart.update('active');
  }

  updateSoilMoistureChart() {
    if (!this.soilMoistureChart) {
      console.log('Admin soil moisture chart not initialized yet');
      return;
    }
    
    console.log('Updating admin soil moisture chart with', this.soilMoistureLog.length, 'data points');
    const labels = this.soilMoistureLog.map(log => new Date(log.timestamp).toLocaleTimeString());
    const data = this.soilMoistureLog.map(log => log.value);
    
    this.soilMoistureChart.data.labels = labels;
    this.soilMoistureChart.data.datasets[0].data = data;
    this.soilMoistureChart.update('active');
  }

  updateCombinedChart() {
    if (!this.combinedChart) {
      console.log('Admin combined chart not initialized yet');
      return;
    }
    
    console.log('Updating admin combined chart');
    const labels = this.temperatureLog.map(log => new Date(log.timestamp).toLocaleTimeString());
    const tempData = this.temperatureLog.map(log => log.value);
    const humData = this.humidityLog.map(log => log.value);
    const soilData = this.soilMoistureLog.map(log => log.value);
    
    this.combinedChart.data.labels = labels;
    this.combinedChart.data.datasets[0].data = tempData;
    this.combinedChart.data.datasets[1].data = humData;
    this.combinedChart.data.datasets[2].data = soilData;
    this.combinedChart.update('active');
  }

  startAutoUpdate() {
    if (this.autoUpdate) {
      this.refreshInterval = setInterval(() => {
        this.loadAllData();
      }, this.updateFrequency);
    }
  }

  updateRefreshInterval() {
    console.log('Updating admin refresh interval to:', this.updateFrequency, 'ms');
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.startAutoUpdate();
  }

  toggleAutoUpdate() {
    this.autoUpdate = !this.autoUpdate;
    if (this.autoUpdate) {
      this.startAutoUpdate();
    } else {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    }
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  goToTemperature() {
    this.router.navigate(['/admin/temperature']);
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Statistics methods
  getAverageTemperature(): number {
    if (this.temperatureLog.length === 0) return 0;
    const sum = this.temperatureLog.reduce((acc, log) => acc + log.value, 0);
    return Math.round((sum / this.temperatureLog.length) * 10) / 10;
  }

  getTemperatureRange(): number {
    if (this.temperatureLog.length === 0) return 0;
    const values = this.temperatureLog.map(log => log.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return Math.round((max - min) * 10) / 10;
  }

  getAverageHumidity(): number {
    if (this.humidityLog.length === 0) return 0;
    const sum = this.humidityLog.reduce((acc, log) => acc + log.value, 0);
    return Math.round((sum / this.humidityLog.length) * 10) / 10;
  }

  getHumidityRange(): number {
    if (this.humidityLog.length === 0) return 0;
    const values = this.humidityLog.map(log => log.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return Math.round((max - min) * 10) / 10;
  }

  getAverageSoilMoisture(): number {
    if (this.soilMoistureLog.length === 0) return 0;
    const sum = this.soilMoistureLog.reduce((acc, log) => acc + log.value, 0);
    return Math.round((sum / this.soilMoistureLog.length) * 10) / 10;
  }

  getSoilMoistureRange(): number {
    if (this.soilMoistureLog.length === 0) return 0;
    const values = this.soilMoistureLog.map(log => log.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return Math.round((max - min) * 10) / 10;
  }
}
