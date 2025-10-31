import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🌱 AgriWatch - User Login</h1>
          <p>Welcome back! Please sign in to continue.</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="Enter your email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Please enter a valid email address
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder="Enter your password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>
          
          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="login-btn">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Signing In...</span>
          </button>
        </form>
        
        <div class="login-footer">
          <a routerLink="/forgot-password" class="forgot-password">Forgot Password?</a>
          <p>Don't have an account? <a routerLink="/signup" class="signup-link">Sign Up</a></p>
          <p>Admin? <a routerLink="/login/admin" class="admin-link">Go to Admin Login</a></p>
        </div>
        
        <div class="error-alert" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
    .login-card { background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); padding: 40px; width: 100%; max-width: 400px; }
    .login-header { text-align: center; margin-bottom: 30px; }
    .login-header h1 { color: #2c3e50; margin-bottom: 10px; font-size: 2rem; }
    .login-header p { color: #7f8c8d; margin: 0; }
    .login-form { margin-bottom: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500; }
    .form-group input { width: 100%; padding: 12px 16px; border: 2px solid #e1e8ed; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease; box-sizing: border-box; }
    .form-group input:focus { outline: none; border-color: #667eea; }
    .form-group input.error { border-color: #e74c3c; }
    .error-message { color: #e74c3c; font-size: 14px; margin-top: 5px; }
    .login-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s ease; }
    .login-btn:hover:not(:disabled) { transform: translateY(-2px); }
    .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .login-footer { text-align: center; margin-top: 20px; }
    .forgot-password { color: #667eea; text-decoration: none; font-weight: 500; }
    .forgot-password:hover { text-decoration: underline; }
    .signup-link { color: #667eea; text-decoration: none; font-weight: 600; }
    .signup-link:hover { text-decoration: underline; }
    .admin-link { color: #667eea; text-decoration: none; font-weight: 500; }
    .admin-link:hover { text-decoration: underline; }
    .error-alert { background: #fee; color: #e74c3c; padding: 12px; border-radius: 8px; margin-top: 20px; text-align: center; border: 1px solid #fcc; }
  `]
})
export class UserLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.router.navigate(['/user/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}
