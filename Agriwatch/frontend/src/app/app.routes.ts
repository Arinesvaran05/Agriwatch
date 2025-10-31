import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login/user', pathMatch: 'full' },
  { path: 'login', redirectTo: '/login/user', pathMatch: 'full' },
  { path: 'login/user', loadComponent: () => import('./features/auth/user-login/user-login.component').then(m => m.UserLoginComponent) },
  { path: 'login/admin', loadComponent: () => import('./features/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'verify-email', loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  
  // User routes (protected)
  { 
    path: 'user', 
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/user/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'humidity', loadComponent: () => import('./features/user/humidity/humidity.component').then(m => m.HumidityComponent) },
      { path: 'temperature', loadComponent: () => import('./features/user/temperature/temperature.component').then(m => m.TemperatureComponent) },
      { path: 'soil-moisture', loadComponent: () => import('./features/user/soil-moisture/soil-moisture.component').then(m => m.SoilMoistureComponent) },
      { path: 'data-visualization', loadComponent: () => import('./features/user/data-visualization/data-visualization.component').then(m => m.DataVisualizationComponent) },
      { path: 'profile', loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'change-password', loadComponent: () => import('./features/user/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Admin routes (protected)
  { 
    path: 'admin', 
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'humidity', loadComponent: () => import('./features/admin/humidity/admin-humidity.component').then(m => m.AdminHumidityComponent) },
      { path: 'temperature', loadComponent: () => import('./features/admin/temperature/admin-temperature.component').then(m => m.AdminTemperatureComponent) },
      { path: 'soil-moisture', loadComponent: () => import('./features/admin/soil-moisture/admin-soil-moisture.component').then(m => m.AdminSoilMoistureComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'data-visualization', loadComponent: () => import('./features/admin/data-visualization/admin-data-visualization.component').then(m => m.AdminDataVisualizationComponent) },
      { path: 'profile', loadComponent: () => import('./features/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent) },
      { path: 'change-password', loadComponent: () => import('./features/admin/change-password/admin-change-password.component').then(m => m.AdminChangePasswordComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Catch all route
  { path: '**', redirectTo: '/login' }
];
