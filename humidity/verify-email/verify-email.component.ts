import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verify-email-container">
      <div class="verify-email-card">
        <div class="verify-email-header">
          <h1>🌱 AgriWatch</h1>
          <p>Email Verification</p>
        </div>
        
        <div *ngIf="!isVerified && !isError" class="verifying">
          <div class="loading-spinner"></div>
          <h3>Verifying your email...</h3>
          <p>Please wait while we verify your email address.</p>
        </div>
        
        <div *ngIf="isVerified" class="success-message">
          <div class="success-icon">✓</div>
          <h3>Email Verified!</h3>
          <p>Your email has been successfully verified. You can now sign in to your account.</p>
          <button (click)="goToLogin()" class="login-btn">Sign In</button>
        </div>
        
        <div *ngIf="isError" class="error-message">
          <div class="error-icon">✗</div>
          <h3>Verification Failed</h3>
          <p>{{ errorMessage }}</p>
          <button (click)="goToLogin()" class="login-btn">Back to Sign In</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-email-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .verify-email-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    
    .verify-email-header {
      margin-bottom: 30px;
    }
    
    .verify-email-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .verify-email-header p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.2rem;
    }
    
    .verifying {
      padding: 20px 0;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .verifying h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .verifying p {
      color: #7f8c8d;
      margin: 0;
    }
    
    .success-message, .error-message {
      padding: 20px 0;
    }
    
    .success-icon, .error-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 20px;
    }
    
    .success-icon {
      background: #27ae60;
      color: white;
    }
    
    .error-icon {
      background: #e74c3c;
      color: white;
    }
    
    .success-message h3, .error-message h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }
    
    .success-message p, .error-message p {
      color: #7f8c8d;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    
    .login-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  isVerified = false;
  isError = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.isError = true;
        this.errorMessage = 'Invalid verification link.';
      }
    });
  }

  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.isVerified = true;
      },
      error: (error) => {
        this.isError = true;
        this.errorMessage = error.error?.message || 'Email verification failed. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
