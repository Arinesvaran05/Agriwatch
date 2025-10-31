import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="change-password-container">
      <div class="password-header">
        <h1>🔒 Change Password</h1>
        <p>Update your account password</p>
      </div>

      <div class="password-card">
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="password-form">
          <div class="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              formControlName="currentPassword" 
              placeholder="Enter your current password"
            >
            <div class="error" *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched">
              Current password is required
            </div>
          </div>
          
          <div class="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              formControlName="newPassword" 
              placeholder="Enter your new password"
            >
            <div class="error" *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched">
              New password must be at least 6 characters
            </div>
          </div>
          
          <div class="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              formControlName="confirmPassword" 
              placeholder="Confirm your new password"
            >
            <div class="error" *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched">
              Passwords do not match
            </div>
          </div>
          
          <div class="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li [class.met]="passwordForm.get('newPassword')?.value?.length >= 6">
                At least 6 characters long
              </li>
              <li [class.met]="passwordForm.get('newPassword')?.value && passwordForm.get('confirmPassword')?.value && 
                              passwordForm.get('newPassword')?.value === passwordForm.get('confirmPassword')?.value">
                Passwords match
              </li>
            </ul>
          </div>
          
          <div class="form-actions">
            <button type="button" routerLink="/admin/profile" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" [disabled]="passwordForm.invalid || isLoading" class="submit-btn">
              {{ isLoading ? 'Changing Password...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
      
      <div class="success-message" *ngIf="successMessage">
        {{ successMessage }}
      </div>
      
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .change-password-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .password-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .password-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .password-header p {
      color: #7f8c8d;
      margin: 0;
    }

    .password-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .password-form {
      max-width: 400px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 600;
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

    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .password-requirements {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }

    .password-requirements h4 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 14px;
    }

    .password-requirements ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .password-requirements li {
      color: #6c757d;
      font-size: 14px;
      margin-bottom: 5px;
      padding-left: 20px;
      position: relative;
    }

    .password-requirements li:before {
      content: '✗';
      position: absolute;
      left: 0;
      color: #dc3545;
    }

    .password-requirements li.met {
      color: #155724;
    }

    .password-requirements li.met:before {
      content: '✓';
      color: #28a745;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .cancel-btn, .submit-btn {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .cancel-btn {
      background: #95a5a6;
      color: white;
    }

    .cancel-btn:hover {
      transform: translateY(-2px);
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px 20px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      border: 1px solid #c3e6cb;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px 20px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class AdminChangePasswordComponent {
  passwordForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const passwordData = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.authService.changePassword(passwordData.currentPassword, passwordData.newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Password changed successfully!';
          this.passwordForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }
}
