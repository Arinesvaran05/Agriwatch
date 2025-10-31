import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <!-- Header -->
      <header class="profile-header">
        <div class="header-content">
          <h1>👤 User Profile</h1>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="profile-nav">
        <a routerLink="/user/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/user/temperature" class="nav-item">Temperature</a>
        <a routerLink="/user/humidity" class="nav-item">Humidity</a>
        <a routerLink="/user/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/user/profile" class="nav-item active">Profile</a>
      </nav>

      <!-- Main Content -->
      <main class="profile-main">
        <div class="profile-card">
          <h2>Profile Information</h2>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                placeholder="Enter your full name"
                [class.error]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched"
              >
              <div class="error-message" *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched">
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
                [class.error]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched"
              >
              <div class="error-message" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>
            
            <div class="form-group">
              <label for="role">Role</label>
              <input 
                type="text" 
                id="role" 
                [value]="currentUser?.role" 
                readonly
                class="readonly"
              >
            </div>
            
            <div class="form-group">
              <label for="createdAt">Account Created</label>
              <input 
                type="text" 
                id="createdAt" 
                [value]="currentUser?.createdAt | date:'medium'" 
                readonly
                class="readonly"
              >
            </div>
            
            <button type="submit" [disabled]="profileForm.invalid || isLoading" class="save-btn">
              <span *ngIf="!isLoading">Save Changes</span>
              <span *ngIf="isLoading">Saving...</span>
            </button>
          </form>
          
          <div class="profile-actions">
            <button (click)="navigateToChangePassword()" class="action-btn">Change Password</button>
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
    .profile-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .profile-header {
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

    .profile-nav {
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

    .profile-main {
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .profile-card {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .profile-card h2 {
      color: #2c3e50;
      margin-bottom: 30px;
      font-size: 1.8rem;
      text-align: center;
    }

    .profile-form {
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

    .form-group input.readonly {
      background: #f8f9fa;
      color: #7f8c8d;
      cursor: not-allowed;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .save-btn {
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

    .save-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .save-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .profile-actions {
      text-align: center;
      margin-bottom: 20px;
    }

    .action-btn {
      padding: 12px 24px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .action-btn:hover {
      background: #229954;
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

      .profile-card {
        padding: 20px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  profileForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      const profileData = {
        id: this.currentUser.id,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email
      };
      
      // Debug: Log what we're sending
      console.log('Current user:', this.currentUser);
      console.log('Profile form values:', this.profileForm.value);
      console.log('Sending profile data:', profileData);
      
      this.dataService.updateProfile(profileData).subscribe({
        next: (response) => {
          console.log('Profile update successful:', response);
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully!';
          // Update local user data
          this.currentUser = { ...this.currentUser, ...profileData };
          this.authService.updateCurrentUser(this.currentUser);
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Profile update error:', error);
          console.error('Error details:', error.error);
          console.error('Error message:', error.error?.message);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  navigateToChangePassword() {
    this.router.navigate(['/user/change-password']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
