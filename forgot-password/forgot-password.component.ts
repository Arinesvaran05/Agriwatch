import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <div class="forgot-password-header">
          <h1>🌱 AgriWatch</h1>
          <p>Reset your password</p>
        </div>
        
        <div *ngIf="!emailSent" class="forgot-password-form">
          <p class="instruction">Enter your email address and we'll send you a link to reset your password.</p>
          
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="Enter your email"
                [class.error]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
              >
              <div class="error-message" *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>
            
            <button type="submit" [disabled]="forgotPasswordForm.invalid || isLoading" class="reset-btn">
              <span *ngIf="!isLoading">Send Reset Link</span>
              <span *ngIf="isLoading">Sending...</span>
            </button>
          </form>
        </div>
        
        <div *ngIf="emailSent" class="success-message">
          <div class="success-icon">✓</div>
          <h3>Check Your Email</h3>
          <p>We've sent a password reset link to <strong>{{ forgotPasswordForm.get('email')?.value }}</strong></p>
          <p>Please check your email and click the link to reset your password.</p>
        </div>
        
        <div class="forgot-password-footer">
          <a routerLink="/login" class="back-to-login">Back to Sign In</a>
        </div>
        
        <div class="error-alert" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .forgot-password-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    
    .forgot-password-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .forgot-password-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .forgot-password-header p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.2rem;
    }
    
    .instruction {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 25px;
      line-height: 1.5;
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
      font-size: 16px;
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
    
    .reset-btn {
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
    
    .reset-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .reset-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .success-message {
      text-align: center;
      padding: 20px 0;
    }
    
    .success-icon {
      width: 60px;
      height: 60px;
      background: #27ae60;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 20px;
    }
    
    .success-message h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }
    
    .success-message p {
      color: #7f8c8d;
      margin-bottom: 10px;
      line-height: 1.5;
    }
    
    .forgot-password-footer {
      text-align: center;
      margin-top: 20px;
    }
    
    .back-to-login {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .back-to-login:hover {
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
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.emailSent = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
        }
      });
    }
  }
}
