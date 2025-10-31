import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="forgot-container">
      <div class="forgot-card">
        <div class="forgot-header">
          <h1>🌱 AgriWatch</h1>
          <p>Reset your password</p>
        </div>
        
        <div class="forgot-content" *ngIf="!isResetCodeSent">
          <p class="instruction">
            Enter your email address and we'll send you a 4-digit code to reset your password.
          </p>
          
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="Enter your email"
                [class.error]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched"
              >
              <div class="error-message" *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>
            
            <button type="submit" [disabled]="forgotForm.invalid || isLoading" class="submit-btn">
              <span *ngIf="!isLoading">Send Reset Code</span>
              <span *ngIf="isLoading">Sending...</span>
            </button>
          </form>
        </div>
        
        <div class="reset-content" *ngIf="isResetCodeSent && !isPasswordReset">
          <p class="instruction">
            We've sent a 4-digit reset code to <strong>{{ userEmail }}</strong>
          </p>
          
          <form [formGroup]="resetForm" (ngSubmit)="onResetSubmit()" class="reset-form">
            <div class="form-group">
              <label for="resetCode">Reset Code</label>
              <input 
                type="text" 
                id="resetCode" 
                formControlName="reset_code" 
                placeholder="Enter 4-digit code"
                maxlength="4"
                [class.error]="resetForm.get('reset_code')?.invalid && resetForm.get('reset_code')?.touched"
              >
              <div class="error-message" *ngIf="resetForm.get('reset_code')?.invalid && resetForm.get('reset_code')?.touched">
                Please enter a valid 4-digit code
              </div>
            </div>
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <div class="password-input-container">
                <input 
                  [type]="showNewPassword ? 'text' : 'password'" 
                  id="newPassword" 
                  formControlName="new_password" 
                  placeholder="Enter new password"
                  [class.error]="resetForm.get('new_password')?.invalid && resetForm.get('new_password')?.touched"
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  (click)="toggleNewPasswordVisibility()"
                  [attr.aria-label]="showNewPassword ? 'Hide new password' : 'Show new password'"
                >
                  <span *ngIf="!showNewPassword" class="eye-icon">👁</span>
                  <span *ngIf="showNewPassword" class="eye-slash-icon">🚫</span>
                </button>
              </div>
              <div class="error-message" *ngIf="resetForm.get('new_password')?.invalid && resetForm.get('new_password')?.touched">
                Password must be at least 6 characters long
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="password-input-container">
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  formControlName="confirm_password" 
                  placeholder="Confirm new password"
                  [class.error]="(resetForm.get('confirm_password')?.invalid && resetForm.get('confirm_password')?.touched) || (resetForm.hasError('passwordMismatch') && resetForm.get('confirm_password')?.touched)"
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  (click)="toggleConfirmPasswordVisibility()"
                  [attr.aria-label]="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                >
                  <span *ngIf="!showConfirmPassword" class="eye-icon">👁</span>
                  <span *ngIf="showConfirmPassword" class="eye-slash-icon">🚫</span>
                </button>
              </div>
              <div class="error-message" *ngIf="(resetForm.get('confirm_password')?.touched)">
                <span *ngIf="resetForm.get('confirm_password')?.hasError('required')">Confirm password is required</span>
                <span *ngIf="!resetForm.get('confirm_password')?.hasError('required') && resetForm.hasError('passwordMismatch')">Passwords do not match</span>
              </div>
            </div>
            
            <button type="submit" [disabled]="resetForm.invalid || isResetting" class="reset-btn">
              <span *ngIf="!isResetting">Reset Password</span>
              <span *ngIf="isResetting">Resetting...</span>
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
        
        <div class="success-content" *ngIf="isPasswordReset">
          <div class="success-icon">✅</div>
          <h2>Password Reset Successfully!</h2>
          <p>Your password has been reset. You can now log in with your new password.</p>
          <button (click)="goToLogin()" class="login-btn">Go to Login</button>
        </div>
        
        <div class="forgot-footer">
          <p>Remember your password? <a routerLink="/login" class="login-link">Sign In</a></p>
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
    .forgot-container {
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
    
    .forgot-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
    }
    
    .forgot-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .forgot-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .forgot-header p {
      color: #7f8c8d;
      margin: 0;
    }
    
    .forgot-content, .reset-content {
      margin-bottom: 20px;
    }
    
    .instruction {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    
    .forgot-form, .reset-form {
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
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }
    
    .password-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .password-input-container input {
      padding-right: 50px;
    }
    
    .password-toggle {
      position: absolute;
      right: 8px;
      background: #f5f5f5;
      border: 1px solid #ccc;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 6px;
      border-radius: 3px;
      transition: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: #333;
      font-family: monospace;
    }
    
    .password-toggle:hover {
      background-color: #e9e9e9;
      border-color: #999;
    }
    
    .password-toggle:focus {
      outline: 1px solid #666;
      outline-offset: 1px;
    }
    
    .password-toggle:active {
      background-color: #ddd;
    }
    
    .eye-icon, .eye-slash-icon {
      font-size: 12px;
      line-height: 1;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .form-group input.error {
      border-color: #e74c3c;
    }
    
    .form-group input[type="text"] {
      text-align: center;
      letter-spacing: 4px;
      font-size: 18px;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .submit-btn, .reset-btn {
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
    
    .submit-btn:hover:not(:disabled), .reset-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .submit-btn:disabled, .reset-btn:disabled {
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
    
    .forgot-footer {
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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  resetForm: FormGroup;
  isLoading = false;
  isResetting = false;
  isResending = false;
  isResetCodeSent = false;
  isPasswordReset = false;
  errorMessage = '';
  successMessage = '';
  userEmail = '';
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      reset_code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('new_password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    // Only flag mismatch when both fields are non-empty
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.forgotPassword(this.forgotForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isResetCodeSent = true;
          this.userEmail = this.forgotForm.value.email;
          this.successMessage = response.message || 'Reset code sent successfully!';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to send reset code. Please try again.';
        }
      });
    }
  }

  onResetSubmit() {
    if (this.resetForm.valid) {
      this.isResetting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const resetData = {
        email: this.userEmail,
        reset_code: this.resetForm.value.reset_code,
        new_password: this.resetForm.value.new_password
      };

      this.authService.resetPassword(resetData).subscribe({
        next: (response) => {
          this.isResetting = false;
          this.isPasswordReset = true;
          this.successMessage = response.message || 'Password reset successfully!';
        },
        error: (error) => {
          this.isResetting = false;
          this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
        }
      });
    }
  }

  resendCode() {
    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword({ email: this.userEmail }).subscribe({
      next: (response) => {
        this.isResending = false;
        this.successMessage = response.message || 'New reset code sent!';
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
