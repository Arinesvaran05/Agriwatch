import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_email_verified: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  reset_code: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  email: string;
  current_password: string;
  new_password: string;
}

export interface ConfirmPasswordChangeRequest {
  email: string;
  verification_code: string;
  new_password_hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost/agriwatch/backend/api';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/login.php`, loginData)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  loginUser(loginData: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/user-login.php`, loginData)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  loginAdmin(loginData: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/admin-login.php`, loginData)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  signup(signupData: SignupRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup.php`, signupData);
  }

  verifyEmail(verifyData: VerifyEmailRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email.php`, verifyData);
  }

  resendVerification(resendData: ResendVerificationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-verification.php`, resendData);
  }

  forgotPassword(forgotData: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password.php`, forgotData);
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password.php`, resetData);
  }

  changePassword(changeData: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password.php`, changeData);
  }

  confirmPasswordChange(confirmData: ConfirmPasswordChangeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/confirm-password-change.php`, confirmData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  isEmailVerified(): boolean {
    return this.currentUserValue?.is_email_verified || false;
  }

  verifyEmailToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email.php`, { token });
  }

  updateCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
