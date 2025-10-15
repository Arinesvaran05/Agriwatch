import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="verify-container">
      <div class="verify-card">
        <div class="verify-header">
          <h1>🌱 AgriWatch</h1>
          <p>Verify your email address</p>
        </div>
        
        <div class="verify-content" *ngIf="!isVerified">
          <p class="instruction">
            We've sent a 4-digit verification code to <strong>{{ userEmail }}</strong>
          </p>
          
          <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()" class="verify-form">
            <div class="form-group">
              <label for="verificationCode">Verification Code</label>
              <input 
                type="text" 
                id="verificationCode" 
                formControlName="verification_code" 
                placeholder="Enter 4-digit code"
                maxlength="4"
                [class.error]="verifyForm.get('verification_code')?.invalid && verifyForm.get('verification_code')?.touched"
              >
              <div class="error-message" *ngIf="verifyForm.get('verification_code')?.invalid && verifyForm.get('verification_code')?.touched">
                Please enter a valid 4-digit code
              </div>
            </div>
            
            <button type="submit" [disabled]="verifyForm.invalid || isLoading" class="verify-btn">
              <span *ngIf="!isLoading">Verify Email</span>
              <span *ngIf="isLoading">Verifying...</span>
            </button>
          </form>
          
          <div class="resend-section">
            <p>Didn't receive the code?</p>
            <button (click)="resendCode()" [disabled]="isResending" class="resend-btn">
              <span *ngIf="!isResending">Resend Code</span>
              <span *ngIf="isResending">Sending...</span>
            </button>
          </div>
        </div>
        
        <div class="success-content" *ngIf="isVerified">
          <div class="success-icon">✅</div>
          <h2>Email Verified Successfully!</h2>
          <p>Your email has been verified. You can now log in to your account.</p>
          <button (click)="goToLogin()" class="login-btn">Go to Login</button>
        </div>
        
        <div class="verify-footer">
          <p>Already have an account? <a routerLink="/login" class="login-link">Sign In</a></p>
        </div>
        
        <div class="error-alert" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="success-alert" *ngIf="successMessage">
          {{ successMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      padding: 20px;
    }
    
    .verify-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
    }
    
    .verify-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .verify-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .verify-header p {
      color: #7f8c8d;
      margin: 0;
    }
    
    .verify-content {
      margin-bottom: 20px;
    }
    
    .instruction {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    
    .verify-form {
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 500;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e8ed;
      border-radius: 10px;
      font-size: 18px;
      text-align: center;
      letter-spacing: 4px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .form-group input.error {
      border-color: #e74c3c;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .verify-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .verify-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .verify-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .resend-section {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e1e8ed;
    }
    
    .resend-section p {
      color: #7f8c8d;
      margin-bottom: 10px;
    }
    
    .resend-btn {
      background: none;
      border: 2px solid #667eea;
      color: #667eea;
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .resend-btn:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }
    
    .resend-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .success-content {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .success-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    .success-content h2 {
      color: #27ae60;
      margin-bottom: 15px;
    }
    
    .success-content p {
      color: #7f8c8d;
      margin-bottom: 25px;
    }
    
    .login-btn {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
    }
    
    .verify-footer {
      text-align: center;
      margin-top: 20px;
    }
    
    .login-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .login-link:hover {
      text-decoration: underline;
    }
    
    .error-alert {
      background: #fee;
      color: #e74c3c;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      border: 1px solid #fcc;
    }
    
    .success-alert {
      background: #efe;
      color: #27ae60;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      border: 1px solid #cfc;
    }
  `]
})
export class VerifyEmailComponent {
  verifyForm: FormGroup;
  isLoading = false;
  isResending = false;
  isVerified = false;
  errorMessage = '';
  successMessage = '';
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      verification_code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });

    // Get email from route parameters or localStorage
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
    });

    // If no email in route, try to get from localStorage or show input
    if (!this.userEmail) {
      // You could add an email input field here if needed
      this.userEmail = 'your email address';
    }
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const verifyData = {
        email: this.userEmail,
        verification_code: this.verifyForm.value.verification_code
      };

      this.authService.verifyEmail(verifyData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isVerified = true;
          this.successMessage = response.message || 'Email verified successfully!';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Verification failed. Please try again.';
        }
      });
    }
  }

  resendCode() {
    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    const resendData = {
      email: this.userEmail
    };

    this.authService.resendVerification(resendData).subscribe({
      next: (response) => {
        this.isResending = false;
        this.successMessage = response.message || 'New verification code sent!';
      },
      error: (error) => {
        this.isResending = false;
        this.errorMessage = error.error?.message || 'Failed to resend code. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
