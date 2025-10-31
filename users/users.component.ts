import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  created_at: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>👥 User Management</h1>
        <button class="add-btn" (click)="showAddForm = true">+ Add New User</button>
      </div>

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
              <input type="password" formControlName="password" placeholder="Enter password">
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
            <h2>Edit User</h2>
            <button class="close-btn" (click)="showEditForm = false">&times;</button>
          </div>
          <form [formGroup]="editUserForm" (ngSubmit)="updateUser()" class="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" formControlName="name" placeholder="Enter user name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="Enter user email">
            </div>
            <div class="form-group">
              <label>Role</label>
              <select formControlName="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" (click)="showEditForm = false" class="cancel-btn">Cancel</button>
              <button type="submit" [disabled]="editUserForm.invalid || isLoading" class="submit-btn">
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
              <span class="verification-badge" [class.verified]="user.isEmailVerified">
                {{ user.isEmailVerified ? '✓ Verified' : '✗ Unverified' }}
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
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin: 0;
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

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #667eea;
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
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showAddForm = false;
  showEditForm = false;
  isLoading = false;
  selectedUser: User | null = null;
  
  addUserForm: FormGroup;
  editUserForm: FormGroup;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
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

  loadUsers() {
    this.isLoading = true;
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
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
      const updateData = { ...this.editUserForm.value, id: this.selectedUser.id };
      this.dataService.updateUser(updateData).subscribe({
        next: () => {
          this.loadUsers();
          this.showEditForm = false;
          this.selectedUser = null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;
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
}
