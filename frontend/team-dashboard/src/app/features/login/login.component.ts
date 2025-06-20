
import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login response:', response); // для debug

        // Токен уже збережено в AuthService
        // Username теж збережено (якщо є в response)

        // Якщо username не в response, отримуємо його окремо
        if (!response.user?.username) {
          this.authService.getCurrentUser().subscribe({
            next: (user) => {
              localStorage.setItem('username', user.username);
              this.router.navigate(['/app/dashboard']);
            },
            error: (err) => {
              console.error('Failed to get current user', err);
              // Все одно переходимо на dashboard
              this.router.navigate(['/app/dashboard']);
            }
          });
        } else {
          // Username уже є, переходимо на dashboard
          this.router.navigate(['/app/dashboard']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}
