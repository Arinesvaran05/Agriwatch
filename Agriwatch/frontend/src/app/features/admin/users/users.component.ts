

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService, User, UsersResponse } from '../../../core/data.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="admin-users-container">
      <!-- Header -->
      <header class="admin-users-header">
        <div class="header-content">
          <div class="header-left">
            <button (click)="goBack()" class="back-btn">← Back</button>
            <h1>👥 Admin User Management</h1>
          </div>
          <div class="user-info">
            <span>Welcome, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
          <nav class="admin-users-nav">
            <a routerLink="/admin/dashboard" class="nav-item">Dashboard</a>
            <a routerLink="/admin/temperature" class="nav-item">Temperature</a>
            <a routerLink="/admin/humidity" class="nav-item">Humidity</a>
            <a routerLink="/admin/soil-moisture" class="nav-item">Soil Moisture</a>
            <a routerLink="/admin/users" class="nav-item active">Users</a>
            <a routerLink="/admin/data-visualization" class="nav-item">Data Visualization</a>
            <a routerLink="/admin/profile" class="nav-item">Profile</a>
          </nav>

      <!-- Main Content -->
      <main class="admin-users-main">
        <!-- User Management Controls -->
        <section class="user-controls">
          <div class="controls-header">
            <h2>User Management</h2>
            <div class="controls-actions">
              <button (click)="loadUsers()" class="refresh-btn" [disabled]="isLoading">
                {{ isLoading ? 'Refreshing...' : '🔄 Refresh' }}
              </button>
              <button class="add-btn" (click)="showAddForm = true">+ Add New User</button>
            </div>
          </div>
        </section>

      <!-- Add User Form -->
      <div class="modal" *ngIf="showAddForm" (click)="closeModal($event)">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Add New User</h2>
            <button class="close-btn" (click)="showAddForm = false">&times;</button>
          </div>
          <form [formGroup]="addUserForm" (ngSubmit)="addUser()" class="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" formControlName="name" placeholder="Enter user name">
              <div class="error" *ngIf="addUserForm.get('name')?.invalid && addUserForm.get('name')?.touched">
                Name is required
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="Enter user email">
              <div class="error" *ngIf="addUserForm.get('email')?.invalid && addUserForm.get('email')?.touched">
                Valid email is required
              </div>
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="password-input-container">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="Enter password">
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
              <div class="error" *ngIf="addUserForm.get('password')?.invalid && addUserForm.get('password')?.touched">
                Password must be at least 6 characters
              </div>
            </div>
            <div class="form-group">
              <label>Role</label>
              <select formControlName="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" (click)="showAddForm = false" class="cancel-btn">Cancel</button>
              <button type="submit" [disabled]="addUserForm.invalid || isLoading" class="submit-btn">
                {{ isLoading ? 'Adding...' : 'Add User' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit User Form -->
      <div class="modal" *ngIf="showEditForm" (click)="closeModal($event)">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Edit User: {{ selectedUser?.name }}</h2>
            <button class="close-btn" (click)="showEditForm = false">&times;</button>
          </div>
          <form [formGroup]="editUserForm" (ngSubmit)="updateUser()" class="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" formControlName="name" placeholder="Enter user name" 
                     [class.changed]="isValidChange('name')"
                     [class.error]="editUserForm.get('name')?.invalid && editUserForm.get('name')?.touched">
              <div class="error" *ngIf="editUserForm.get('name')?.invalid && editUserForm.get('name')?.touched">
                Name is required and cannot be empty
              </div>
              <div class="changed-indicator" *ngIf="isValidChange('name')">
                ✓ Changed from "{{ selectedUser?.name }}" to "{{ editUserForm.get('name')?.value }}"
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="Enter user email"
                     [class.changed]="isValidChange('email')"
                     [class.error]="editUserForm.get('email')?.invalid && editUserForm.get('email')?.touched">
              <div class="error" *ngIf="editUserForm.get('email')?.invalid && editUserForm.get('email')?.touched">
                Valid email is required and cannot be empty
              </div>
              <div class="changed-indicator" *ngIf="isValidChange('email')">
                ✓ Changed from "{{ selectedUser?.email }}" to "{{ editUserForm.get('email')?.value }}"
              </div>
            </div>
            <div class="form-group">
              <label>Role</label>
              <select formControlName="role" [class.changed]="isValidChange('role')">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div class="changed-indicator" *ngIf="isValidChange('role')">
                ✓ Changed from "{{ selectedUser?.role }}" to "{{ editUserForm.get('role')?.value }}"
              </div>
            </div>
            
            <!-- Changes Summary -->
            <div class="changes-summary" *ngIf="hasValidChanges()">
              <h4>Changes to be made:</h4>
              <ul>
                <li *ngIf="isValidChange('name')">
                  Name: "{{ selectedUser?.name }}" → "{{ editUserForm.get('name')?.value }}"
                </li>
                <li *ngIf="isValidChange('email')">
                  Email: "{{ selectedUser?.email }}" → "{{ editUserForm.get('email')?.value }}"
                </li>
                <li *ngIf="isValidChange('role')">
                  Role: "{{ selectedUser?.role }}" → "{{ editUserForm.get('role')?.value }}"
                </li>
              </ul>
            </div>
            
            <div class="form-actions">
              <button type="button" (click)="showEditForm = false" class="cancel-btn">Cancel</button>
              <button type="submit" [disabled]="editUserForm.invalid || isLoading || !hasValidChanges()" class="submit-btn">
                {{ isLoading ? 'Updating...' : 'Update User' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Users List -->
      <div class="users-list">
        <div class="user-card" *ngFor="let user of users">
          <div class="user-info">
            <div class="user-avatar">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
              <span class="role-badge" [class.admin]="user.role === 'admin'">
                {{ user.role }}
              </span>
              <span class="verification-badge" [class.verified]="user.is_email_verified">
                {{ user.is_email_verified ? '✓ Verified' : '✗ Unverified' }}
              </span>
            </div>
          </div>
          <div class="user-actions">
            <button class="edit-btn" (click)="editUser(user)">Edit</button>
            <button class="delete-btn" (click)="deleteUser(user.id)" [disabled]="user.role === 'admin'">
              Delete
            </button>
          </div>
        </div>
      </div>

        <div class="no-users" *ngIf="users.length === 0">
          <p>No users found. Add your first user!</p>
        </div>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button (click)="goToDashboard()" class="action-btn">🏠 Dashboard</button>
            <button (click)="goToTemperature()" class="action-btn">🌡️ Temperature</button>
            <button (click)="goToHumidity()" class="action-btn">💧 Humidity</button>
            <button (click)="goToSoilMoisture()" class="action-btn">🌱 Soil Moisture</button>
            <button (click)="goToDataVisualization()" class="action-btn">📊 Data Visualization</button>
            <button (click)="goToProfile()" class="action-btn">👤 Profile</button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-users-container {
      min-height: calc(100vh - 200px);
      background: #f8f9fa;
      padding-bottom: 20px;
    }

    .admin-users-header {
      background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
      font-size: 1rem;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
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

    .admin-users-nav {
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
      color: #17a2b8;
      border-bottom-color: #17a2b8;
    }

    .admin-users-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .user-controls {
      margin-bottom: 40px;
    }

    .controls-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .controls-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.5rem;
    }

    .controls-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .refresh-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .refresh-btn:hover {
      background: #2980b9;
    }

    .refresh-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      color: #7f8c8d;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .add-btn:hover {
      transform: translateY(-2px);
    }

    .users-list {
      display: grid;
      gap: 20px;
    }

    .user-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.2s;
    }

    .user-card:hover {
      transform: translateY(-2px);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
    }

    .user-details h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
    }

    .user-details p {
      margin: 0 0 8px 0;
      color: #7f8c8d;
    }

    .role-badge {
      background: #e8f5e8;
      color: #27ae60;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }

    .role-badge.admin {
      background: #fff3cd;
      color: #856404;
    }

    .verification-badge {
      background: #f8d7da;
      color: #721c24;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .verification-badge.verified {
      background: #d4edda;
      color: #155724;
    }

    .user-actions {
      display: flex;
      gap: 10px;
    }

    .edit-btn, .delete-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .edit-btn {
      background: #3498db;
      color: white;
    }

    .edit-btn:hover {
      background: #2980b9;
    }

    .delete-btn {
      background: #e74c3c;
      color: white;
    }

    .delete-btn:hover:not(:disabled) {
      background: #c0392b;
    }

    .delete-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #7f8c8d;
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

    .form-group input, .form-group select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 16px;
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

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input.changed, .form-group select.changed {
      border-color: #27ae60;
      background-color: #f8fff9;
    }

    .form-group input.error, .form-group select.error {
      border-color: #e74c3c;
      background-color: #fdf2f2;
    }

    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .cancel-btn, .submit-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .cancel-btn {
      background: #95a5a6;
      color: white;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .no-users {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    .changed-indicator {
      font-size: 12px;
      color: #27ae60;
      margin-top: 5px;
      font-weight: 500;
    }

    .changes-summary {
      background-color: #f0f9eb;
      border: 1px solid #e1f3d8;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .changes-summary h4 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #27ae60;
    }

    .changes-summary ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .changes-summary li {
      color: #34495e;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .quick-actions {
      margin-bottom: 40px;
    }

    .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .header-left {
        flex-direction: column;
        gap: 10px;
      }

      .controls-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .action-buttons {
        justify-content: center;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  currentUser: any;
  users: User[] = [];
  showAddForm = false;
  showEditForm = false;
  isLoading = false;
  selectedUser: User | null = null;
  showPassword = false;
  
  addUserForm: FormGroup;
  editUserForm: FormGroup;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });

    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  loadUsers() {
    this.isLoading = true;
    console.log('Loading users...');
    this.dataService.getUsers().subscribe({
      next: (response) => {
        console.log('=== USERS API RESPONSE ===');
        console.log('Full response:', response);
        console.log('Response type:', typeof response);
        console.log('Is array:', Array.isArray(response));
        
        // Handle both old format (array) and new format (object with users property)
        if (Array.isArray(response)) {
          this.users = response;
          console.log('Using array format, users count:', this.users.length);
        } else if (response && response.users) {
          this.users = response.users;
          console.log('Using object format, users count:', this.users.length);
        } else {
          this.users = [];
          console.log('No users found');
        }
        
        // Log each user's verification status
        this.users.forEach((user, index) => {
          console.log(`User ${index + 1}: ${user.name} (${user.email})`);
          console.log(`  - is_email_verified: ${user.is_email_verified}`);
          console.log(`  - Type: ${typeof user.is_email_verified}`);
          console.log(`  - Raw value: ${JSON.stringify(user.is_email_verified)}`);
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  addUser() {
    if (this.addUserForm.valid) {
      this.isLoading = true;
      this.dataService.addUser(this.addUserForm.value).subscribe({
        next: () => {
          this.loadUsers();
          this.showAddForm = false;
          this.addUserForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.isLoading = false;
        }
      });
    }
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.editUserForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    this.showEditForm = true;
  }

  updateUser() {
    if (this.editUserForm.valid && this.selectedUser) {
      this.isLoading = true;
      
      // Always send all required fields along with the ID
      const formValues = this.editUserForm.value;
      const updateData = {
        id: this.selectedUser.id,
        name: formValues.name,
        email: formValues.email,
        role: formValues.role
      };
      
      // Debug: Log what we're sending
      console.log('Sending update data:', updateData);
      console.log('Original user data:', this.selectedUser);
      
      // If no valid changes, just close the form
      if (!this.hasValidChanges()) {
        this.showEditForm = false;
        this.selectedUser = null;
        this.isLoading = false;
        return;
      }
      
      this.dataService.updateUser(updateData).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.loadUsers();
          this.showEditForm = false;
          this.selectedUser = null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;
          // Show user-friendly error message
          if (error.error?.message) {
            alert('Error: ' + error.error.message);
          } else {
            alert('Failed to update user. Please try again.');
          }
        }
      });
    }
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.dataService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.isLoading = false;
        }
      });
    }
  }

  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showAddForm = false;
      this.showEditForm = false;
    }
  }

  hasChanges(): boolean {
    if (!this.selectedUser) {
      return false;
    }
    const formValues = this.editUserForm.value;
    return (
      formValues.name !== this.selectedUser.name ||
      formValues.email !== this.selectedUser.email ||
      formValues.role !== this.selectedUser.role
    );
  }

  isValidChange(fieldName: string): boolean {
    if (!this.selectedUser) {
      return false;
    }
    
    const formValue = this.editUserForm.get(fieldName)?.value;
    const originalValue = this.selectedUser[fieldName as keyof User];
    
    // Check if the value has actually changed
    if (formValue === originalValue) {
      return false;
    }
    
    // For name and email, ensure the new value is not empty
    if (fieldName === 'name' || fieldName === 'email') {
      return formValue && formValue.trim() !== '';
    }
    
    // For role, any change is valid
    return true;
  }

  hasValidChanges(): boolean {
    if (!this.selectedUser) {
      return false;
    }
    
    return this.isValidChange('name') || 
           this.isValidChange('email') || 
           this.isValidChange('role');
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  goToTemperature() {
    this.router.navigate(['/admin/temperature']);
  }

  goToHumidity() {
    this.router.navigate(['/admin/humidity']);
  }

  goToSoilMoisture() {
    this.router.navigate(['/admin/soil-moisture']);
  }

  goToProfile() {
    this.router.navigate(['/admin/profile']);
  }

  goToDataVisualization() {
    this.router.navigate(['/admin/data-visualization']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
