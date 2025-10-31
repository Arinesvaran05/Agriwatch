import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-container">
      <!-- Header with Navigation -->
      <header class="profile-header">
        <div class="header-content">
          <h1>👤 Admin Profile</h1>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation Menu -->
      <nav class="profile-nav">
        <a routerLink="/admin/dashboard" class="nav-item">Dashboard</a>
        <a routerLink="/admin/temperature" class="nav-item">Temperature</a>
        <a routerLink="/admin/humidity" class="nav-item">Humidity</a>
        <a routerLink="/admin/soil-moisture" class="nav-item">Soil Moisture</a>
        <a routerLink="/admin/users" class="nav-item">Users</a>
        <a routerLink="/admin/data-visualization" class="nav-item">Data Visualization</a>
        <a routerLink="/admin/profile" class="nav-item active">Profile</a>
      </nav>

      <div class="profile-content">
        <!-- Back Button -->
        <div class="back-section">
          <button (click)="goBack()" class="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        <div class="profile-card">
          <div class="profile-avatar">
            {{ currentUser?.name?.charAt(0).toUpperCase() || 'A' }}
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" formControlName="name" placeholder="Enter your name">
              <div class="error" *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched">
                Name is required
              </div>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="Enter your email">
              <div class="error" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                Valid email is required
              </div>
            </div>
            
            <div class="form-group">
              <label>Role</label>
              <input type="text" [value]="currentUser?.role" disabled class="disabled-input">
            </div>
            
            <div class="form-group">
              <label>Email Verification</label>
              <div class="verification-status" [class.verified]="currentUser?.is_email_verified">
                {{ currentUser?.is_email_verified ? '✓ Verified' : '✗ Not Verified' }}
              </div>
            </div>
            
            <div class="form-group">
              <label>Account Created</label>
              <input type="text" [value]="formatDate(currentUser?.created_at)" disabled class="disabled-input">
            </div>
            
            <div class="form-actions">
              <button type="submit" [disabled]="profileForm.invalid || isLoading" class="update-btn">
                {{ isLoading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
        
        <div class="profile-actions">
          <a routerLink="/admin/change-password" class="action-btn">
            🔒 Change Password
          </a>
          <a routerLink="/admin/data-visualization" class="action-btn">
            📊 Data Visualization
          </a>
        </div>
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
      padding: 0 40px;
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

    .profile-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .back-section {
      margin-bottom: 20px;
    }

    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: #5a6268;
    }

    .profile-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      text-align: center;
      margin-bottom: 20px;
    }

    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      margin: 0 auto 30px;
    }

    .profile-form {
      max-width: 400px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: left;
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

    .disabled-input {
      background-color: #f8f9fa;
      color: #6c757d;
      cursor: not-allowed;
    }

    .verification-status {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      background: #f8d7da;
      color: #721c24;
    }

    .verification-status.verified {
      background: #d4edda;
      color: #155724;
    }

    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .form-actions {
      margin-top: 30px;
    }

    .update-btn {
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

    .update-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .update-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .profile-actions {
      display: grid;
      gap: 15px;
    }

    .action-btn {
      display: block;
      padding: 16px 24px;
      background: white;
      color: #2c3e50;
      text-decoration: none;
      border-radius: 12px;
      text-align: center;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      border-color: #667eea;
      color: #667eea;
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
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    console.log('Current user data on init:', this.currentUser);
    
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email
      });
      
      // Refresh user data to ensure we have the latest information
      this.refreshUserData();
    }
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updateData = {
        id: this.currentUser.id,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email
      };

      this.dataService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully!';
          console.log('Profile update response:', response);
          
          // Update current user with complete data from response
          if (response.data) {
            const updatedUser = { ...this.currentUser, ...response.data };
            console.log('Updated user data:', updatedUser);
            this.authService.updateCurrentUser(updatedUser);
            this.currentUser = updatedUser;
            
            // Update form with new values
            this.profileForm.patchValue({
              name: response.data.name,
              email: response.data.email
            });
          }
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
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

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refreshUserData() {
    if (this.currentUser?.id) {
      this.dataService.getUser(this.currentUser.id).subscribe({
        next: (userData: any) => {
          console.log('Refreshed user data:', userData);
          // Update current user with fresh data
          this.currentUser = userData;
          this.authService.updateCurrentUser(userData);
          
          // Update form with fresh values
          this.profileForm.patchValue({
            name: userData.name,
            email: userData.email
          });
        },
        error: (error) => {
          console.error('Failed to refresh user data:', error);
        }
      });
    }
  }
}
