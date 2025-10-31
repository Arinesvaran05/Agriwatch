import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="change-container">
      <div class="change-card">
        <div class="change-header">
          <h1>🌱 AgriWatch</h1>
          <p>Admin - Change Password</p>
        </div>
        
        <div class="change-content" *ngIf="!isVerificationSent">
          <p class="instruction">
            Enter your current password and new password to change your admin account password.
          </p>
          
          <form [formGroup]="changeForm" (ngSubmit)="onSubmit()" class="change-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                formControlName="current_password" 
                placeholder="Enter current password"
                [class.error]="changeForm.get('current_password')?.invalid && changeForm.get('current_password')?.touched"
              >
              <div class="error-message" *ngIf="changeForm.get('current_password')?.invalid && changeForm.get('current_password')?.touched">
                Current password is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                formControlName="new_password" 
                placeholder="Enter new password"
                [class.error]="changeForm.get('new_password')?.invalid && changeForm.get('new_password')?.touched"
              >
              <div class="error-message" *ngIf="changeForm.get('new_password')?.invalid && changeForm.get('new_password')?.touched">
                Password must be at least 6 characters long
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirm_password" 
                placeholder="Confirm new password"
                [class.error]="(changeForm.get('confirm_password')?.invalid && changeForm.get('confirm_password')?.touched) || changeForm.hasError('passwordMismatch')"
              >
              <div class="error-message" *ngIf="(changeForm.get('confirm_password')?.invalid && changeForm.get('confirm_password')?.touched) || changeForm.hasError('passwordMismatch')">
                <span *ngIf="changeForm.get('confirm_password')?.hasError('required')">Confirm password is required</span>
                <span *ngIf="!changeForm.get('confirm_password')?.hasError('required') && changeForm.hasError('passwordMismatch')">Passwords do not match</span>
              </div>
            </div>
            
            <button type="submit" [disabled]="changeForm.invalid || isLoading" class="submit-btn">
              <span *ngIf="!isLoading">Send Verification Code</span>
              <span *ngIf="isLoading">Sending...</span>
            </button>
          </form>
        </div>
        
        <div class="verification-content" *ngIf="isVerificationSent && !isPasswordChanged">
          <p class="instruction">
            We've sent a 4-digit verification code to <strong>{{ userEmail }}</strong>
          </p>
          
          <form [formGroup]="verificationForm" (ngSubmit)="onVerificationSubmit()" class="verification-form">
            <div class="form-group">
              <label for="verificationCode">Verification Code</label>
              <input 
                type="text" 
                id="verificationCode" 
                formControlName="verification_code" 
                placeholder="Enter 4-digit code"
                maxlength="4"
                [class.error]="verificationForm.get('verification_code')?.invalid && verificationForm.get('verification_code')?.touched"
              >
              <div class="error-message" *ngIf="verificationForm.get('verification_code')?.invalid && verificationForm.get('verification_code')?.touched">
                Please enter a valid 4-digit code
              </div>
            </div>
            
            <button type="submit" [disabled]="verificationForm.invalid || isVerifying" class="verify-btn">
              <span *ngIf="!isVerifying">Confirm Password Change</span>
              <span *ngIf="isVerifying">Verifying...</span>
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
        
        <div class="success-content" *ngIf="isPasswordChanged">
          <div class="success-icon">✅</div>
          <h2>Password Changed Successfully!</h2>
          <p>Your admin password has been changed. You can now log in with your new password.</p>
          <button (click)="goToDashboard()" class="dashboard-btn">Go to Dashboard</button>
        </div>
        
        <div class="change-footer">
          <button (click)="goBack()" class="back-btn">← Back</button>
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
    .change-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .change-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
    }
    
    .change-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .change-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .change-header p {
      color: #7f8c8d;
      margin: 0;
    }
    
    .change-content, .verification-content {
      margin-bottom: 20px;
    }
    
    .instruction {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    
    .change-form, .verification-form {
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
    
    .submit-btn, .verify-btn {
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
    
    .submit-btn:hover:not(:disabled), .verify-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .submit-btn:disabled, .verify-btn:disabled {
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
    
    .dashboard-btn {
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
    
    .dashboard-btn:hover {
      transform: translateY(-2px);
    }
    
    .change-footer {
      text-align: center;
      margin-top: 20px;
    }
    
    .back-btn {
      background: none;
      border: 2px solid #667eea;
      color: #667eea;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .back-btn:hover {
      background: #667eea;
      color: white;
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
export class AdminChangePasswordComponent {
  changeForm: FormGroup;
  verificationForm: FormGroup;
  isLoading = false;
  isVerifying = false;
  isResending = false;
  isVerificationSent = false;
  isPasswordChanged = false;
  errorMessage = '';
  successMessage = '';
  userEmail = '';
  tempPasswordHash = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changeForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.verificationForm = this.fb.group({
      verification_code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });

    // Get current user email
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userEmail = currentUser.email;
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('new_password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.changeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const changeData = {
        email: this.userEmail,
        current_password: this.changeForm.value.current_password,
        new_password: this.changeForm.value.new_password
      };

      this.authService.changePassword(changeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isVerificationSent = true;
          this.tempPasswordHash = response.temp_password_hash;
          this.successMessage = response.message || 'Verification code sent successfully!';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to send verification code. Please try again.';
        }
      });
    }
  }

  onVerificationSubmit() {
    if (this.verificationForm.valid) {
      this.isVerifying = true;
      this.errorMessage = '';
      this.successMessage = '';

      const confirmData = {
        email: this.userEmail,
        verification_code: this.verificationForm.value.verification_code,
        new_password_hash: this.tempPasswordHash
      };

      this.authService.confirmPasswordChange(confirmData).subscribe({
        next: (response) => {
          this.isVerifying = false;
          this.isPasswordChanged = true;
          this.successMessage = response.message || 'Password changed successfully!';
        },
        error: (error) => {
          this.isVerifying = false;
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }

  resendCode() {
    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    const changeData = {
      email: this.userEmail,
      current_password: this.changeForm.value.current_password,
      new_password: this.changeForm.value.new_password
    };

    this.authService.changePassword(changeData).subscribe({
      next: (response) => {
        this.isResending = false;
        this.tempPasswordHash = response.temp_password_hash;
        this.successMessage = response.message || 'New verification code sent!';
      },
      error: (error) => {
        this.isResending = false;
        this.errorMessage = error.error?.message || 'Failed to resend code. Please try again.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}
