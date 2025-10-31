import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer" [ngClass]="footerClass">
      <div class="footer-content">
        <div class="footer-section">
          <h3>🌱 AgriWatch</h3>
          <p>Smart Agriculture Monitoring System</p>
          <p class="footer-description">
            Monitor your crops with real-time sensor data and intelligent analytics.
          </p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="/user/dashboard">Dashboard</a></li>
            <li><a href="/user/temperature">Temperature</a></li>
            <li><a href="/user/humidity">Humidity</a></li>
            <li><a href="/user/soil-moisture">Soil Moisture</a></li>
            <li><a href="/user/data-visualization">Data Visualization</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Support</h4>
          <ul class="footer-links">
            <li><a href="/user/profile">Profile Settings</a></li>
            <li><a href="/user/change-password">Change Password</a></li>
            <li><a href="mailto:support@agriwatch.com">Contact Support</a></li>
            <li><a href="#" onclick="alert('Help documentation coming soon!')">Help Center</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>System Info</h4>
          <div class="system-info">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> {{ currentDate | date:'medium' }}</p>
            <p><strong>Status:</strong> <span class="status-online">Online</span></p>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; {{ currentYear }} AgriWatch. All rights reserved.</p>
          <div class="footer-social">
            <span>Follow us:</span>
            <a href="#" class="social-link" title="Twitter">🐦</a>
            <a href="#" class="social-link" title="Facebook">📘</a>
            <a href="#" class="social-link" title="LinkedIn">💼</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      color: white;
      margin-top: auto;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .footer-neutral {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }

    .footer-purple {
      background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .footer-cyan {
      background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .footer-neutral {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .footer-hidden {
      display: none;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .footer-section h3 {
      margin: 0 0 15px 0;
      font-size: 1.5rem;
      color: #ffffff;
      font-weight: bold;
    }

    .footer-section h4 {
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      color: #ffffff;
      border-bottom: 2px solid #3498db;
      padding-bottom: 5px;
      display: inline-block;
      font-weight: 600;
    }

    .footer-purple .footer-section h4 {
      border-bottom-color: #ffffff;
    }

    .footer-cyan .footer-section h4 {
      border-bottom-color: #ffffff;
    }

    .footer-section p {
      margin: 0 0 10px 0;
      color: #f8f9fa;
      line-height: 1.6;
    }

    .footer-description {
      font-size: 0.9rem;
      margin-top: 10px;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 8px;
    }

    .footer-links a {
      color: #e9ecef;
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.9rem;
    }

    .footer-links a:hover {
      color: #ffffff;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }

    .footer-purple .footer-links a:hover {
      color: #ffffff;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
    }

    .footer-cyan .footer-links a:hover {
      color: #ffffff;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
    }

    .system-info p {
      margin: 0 0 8px 0;
      font-size: 0.85rem;
      color: #f8f9fa;
    }

    .status-online {
      color: #28a745;
      font-weight: bold;
      text-shadow: 0 0 3px rgba(40, 167, 69, 0.5);
    }

    .footer-bottom {
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid #34495e;
    }

    .footer-bottom-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .footer-bottom p {
      margin: 0;
      color: #f8f9fa;
      font-size: 0.9rem;
    }

    .footer-social {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .footer-social span {
      color: #f8f9fa;
      font-size: 0.9rem;
    }

    .social-link {
      display: inline-block;
      font-size: 1.2rem;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .social-link:hover {
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 25px;
        padding: 30px 20px 15px;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }

      .footer-social {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer-content {
        padding: 25px 15px 10px;
      }

      .footer-section h3 {
        font-size: 1.3rem;
      }

      .footer-section h4 {
        font-size: 1rem;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  currentDate = new Date();
  currentYear = new Date().getFullYear();
  footerClass = 'footer-neutral';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateFooterClass(event.url);
      });
    
    // Set initial class based on current URL
    this.updateFooterClass(this.router.url);
  }

  private updateFooterClass(url: string) {
    // Hide footer on authentication pages
    if (url.startsWith('/login') || 
        url.startsWith('/signup') || 
        url.startsWith('/forgot-password') || 
        url.startsWith('/verify-email') ||
        url === '/' || 
        url === '') {
      this.footerClass = 'footer-hidden';
    } else if (url.startsWith('/user')) {
      this.footerClass = 'footer-purple';
    } else if (url.startsWith('/admin')) {
      this.footerClass = 'footer-cyan';
    } else {
      this.footerClass = 'footer-neutral';
    }
  }
}
