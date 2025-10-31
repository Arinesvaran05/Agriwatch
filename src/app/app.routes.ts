import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login/user', pathMatch: 'full' },
  { path: 'login', redirectTo: '/login/user', pathMatch: 'full' },
  { path: 'login/user', loadComponent: () => import('./components/auth/user-login/user-login.component').then(m => m.UserLoginComponent) },
  { path: 'login/admin', loadComponent: () => import('./components/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'verify-email', loadComponent: () => import('./components/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  
  // User routes (protected)
  { 
    path: 'user', 
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/user/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'humidity', loadComponent: () => import('./components/user/humidity/humidity.component').then(m => m.HumidityComponent) },
      { path: 'temperature', loadComponent: () => import('./components/user/temperature/temperature.component').then(m => m.TemperatureComponent) },
      { path: 'soil-moisture', loadComponent: () => import('./components/user/soil-moisture/soil-moisture.component').then(m => m.SoilMoistureComponent) },
      { path: 'profile', loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'change-password', loadComponent: () => import('./components/user/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Admin routes (protected)
  { 
    path: 'admin', 
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'humidity', loadComponent: () => import('./components/admin/humidity/admin-humidity.component').then(m => m.AdminHumidityComponent) },
      { path: 'temperature', loadComponent: () => import('./components/admin/temperature/admin-temperature.component').then(m => m.AdminTemperatureComponent) },
      { path: 'soil-moisture', loadComponent: () => import('./components/admin/soil-moisture/admin-soil-moisture.component').then(m => m.AdminSoilMoistureComponent) },
      { path: 'users', loadComponent: () => import('./components/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'profile', loadComponent: () => import('./components/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent) },
      { path: 'change-password', loadComponent: () => import('./components/admin/change-password/admin-change-password.component').then(m => m.AdminChangePasswordComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Catch all route
  { path: '**', redirectTo: '/login' }
];
