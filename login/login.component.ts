import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = ''; // Default empty string
  password: string = ''; // Default empty string

  onLogin() {
    console.log('Login details:', this.email, this.password);
  }
}


