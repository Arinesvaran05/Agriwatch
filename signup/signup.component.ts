import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = '';           // Default empty string
  password: string = '';        // Default empty string
  confirmPassword: string = ''; // Default empty string

  onSignup() {
    if (this.password === this.confirmPassword) {
      console.log('Sign Up details:', this.email, this.password);
    } else {
      console.error('Passwords do not match');
    }
  }
}


