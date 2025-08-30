import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="change-password-container">
      <!-- Header -->
      <header class="change-password-header">
        <div class="header-content">
          <h1>🔒 Change Password</h1>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="change-password-nav">
        <a routerLink="/user/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/user/temperature" class="nav-item">Temperature</a>
        <a routerLink="/user/humidity" class="nav-item">Humidity</a>
        <a routerLink="/user/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/user/profile" class="nav-item">Profile</a>
      </nav>

      <!-- Main Content -->
      <main class="change-password-main">
        <div class="change-password-card">
          <h2>Change Your Password</h2>
          
          <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()" class="change-password-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                formControlName="currentPassword" 
                placeholder="Enter your current password"
                [class.error]="changePasswordForm.get('currentPassword')?.invalid && changePasswordForm.get('currentPassword')?.touched"
              >
              <div class="error-message" *ngIf="changePasswordForm.get('currentPassword')?.invalid && changePasswordForm.get('currentPassword')?.touched">
                Current password is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                formControlName="newPassword" 
                placeholder="Enter your new password"
                [class.error]="changePasswordForm.get('newPassword')?.invalid && changePasswordForm.get('newPassword')?.touched"
              >
              <div class="error-message" *ngIf="changePasswordForm.get('newPassword')?.invalid && changePasswordForm.get('newPassword')?.touched">
                New password must be at least 6 characters long
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirmPassword" 
                placeholder="Confirm your new password"
                [class.error]="changePasswordForm.get('confirmPassword')?.invalid && changePasswordForm.get('confirmPassword')?.touched"
              >
              <div class="error-message" *ngIf="changePasswordForm.get('confirmPassword')?.invalid && changePasswordForm.get('confirmPassword')?.touched">
                <span *ngIf="changePasswordForm.get('confirmPassword')?.errors?.['required']">Please confirm your new password</span>
                <span *ngIf="changePasswordForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</span>
              </div>
            </div>
            
            <button type="submit" [disabled]="changePasswordForm.invalid || isLoading" class="change-btn">
              <span *ngIf="!isLoading">Change Password</span>
              <span *ngIf="isLoading">Changing Password...</span>
            </button>
          </form>
          
          <div class="back-link">
            <a routerLink="/user/profile" class="back-btn">← Back to Profile</a>
          </div>
          
          <div class="success-alert" *ngIf="successMessage">
            {{ successMessage }}
          </div>
          
          <div class="error-alert" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .change-password-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .change-password-header {
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

    .change-password-nav {
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

    .change-password-main {
      max-width: 600px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .change-password-card {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .change-password-card h2 {
      color: #2c3e50;
      margin-bottom: 30px;
      font-size: 1.8rem;
      text-align: center;
    }

    .change-password-form {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 25px;
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

    .change-btn {
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
      margin-bottom: 20px;
    }

    .change-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .change-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .back-link {
      text-align: center;
      margin-bottom: 20px;
    }

    .back-btn {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .back-btn:hover {
      color: #5a6fd8;
      text-decoration: underline;
    }

    .success-alert {
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      border: 1px solid #c3e6cb;
    }

    .error-alert {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .change-password-card {
        padding: 20px;
      }
    }
  `]
})
export class ChangePasswordComponent {
  currentUser: any;
  changePasswordForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      const passwordData = {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };
      
      this.authService.changePassword(passwordData.currentPassword, passwordData.newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Password changed successfully!';
          this.changePasswordForm.reset();
          setTimeout(() => {
            this.router.navigate(['/user/profile']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
