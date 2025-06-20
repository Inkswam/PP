import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/userService';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  name = '';
  email = '';
  telegram = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password || !this.telegram) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.errorMessage = '';

    const newUser = {
      username: this.name,
      email: this.email,
      password: this.password,
      telegram: this.telegram
    };

    this.userService.register(newUser).subscribe({
      next: () => {
        alert('Registration successful!')
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Registration failed.')
    });
  }
}
