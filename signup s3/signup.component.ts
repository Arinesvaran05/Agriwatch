import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <div class="signup-header">
          <h1>🌱 AgriWatch</h1>
          <p>Create your account to start monitoring your farm</p>
        </div>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="signup-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              placeholder="Enter your full name"
              [class.error]="signupForm.get('name')?.invalid && signupForm.get('name')?.touched"
            >
            <div class="error-message" *ngIf="signupForm.get('name')?.invalid && signupForm.get('name')?.touched">
              Full name is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="Enter your email"
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
            >
            <div class="error-message" *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched">
              Please enter a valid email address
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                placeholder="Enter your password"
                [class.error]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
              >
              <button 
                type="button" 
                class="password-toggle" 
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
              >
                <span *ngIf="!showPassword" class="eye-icon">👁</span>
                <span *ngIf="showPassword" class="eye-slash-icon">🚫</span>
              </button>
            </div>
            <div class="error-message" *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched">
              Password must be at least 6 characters long
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input-container">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                formControlName="confirmPassword" 
                placeholder="Confirm your password"
                [class.error]="(signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched) || (signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched)"
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
            <div class="error-message" *ngIf="(signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched) || (signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched)">
              <span *ngIf="signupForm.get('confirmPassword')?.hasError('required')">Please confirm your password</span>
              <span *ngIf="signupForm.hasError('passwordMismatch')">Passwords do not match</span>
            </div>
          </div>
          
          <button type="submit" [disabled]="signupForm.invalid || isLoading" class="signup-btn">
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading">Creating Account...</span>
          </button>
        </form>
        
        <div class="signup-footer">
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
    .signup-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      padding: 20px;
    }
    
    .signup-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
    }
    
    .signup-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .signup-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .signup-header p {
      color: #7f8c8d;
      margin: 0;
    }
    
    .signup-form {
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
    
    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .signup-btn {
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
    
    .signup-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .signup-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .signup-footer {
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
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Account created successfully! Please check your email for the 4-digit verification code.';
          
          // Redirect to verification page with email
          setTimeout(() => {
            this.router.navigate(['/verify-email'], {
              queryParams: { email: this.signupForm.value.email }
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
