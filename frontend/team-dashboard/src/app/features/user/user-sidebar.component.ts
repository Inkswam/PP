import { Component } from '@angular/core';
import {AuthService} from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  template: `
    <aside class="user-sidebar">
      <button (click)="logout()" class="logout-btn">
        Вийти
      </button>
    </aside>
  `,
  styles: [`
    .user-sidebar {
      width: 220px;
      background-color: #eee;
      height: calc(100vh - 60px);
      position: fixed;
      top: 60px;
      left: 0;
      border-right: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: start;
      padding-top: 20px;
    }

    .logout-btn {
      background-color: #d9534f;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .logout-btn:hover {
      background-color: #c9302c;
    }
  `]
})
export class UserSidebarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // після успішного logout переходимо на сторінку логіну
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Logout failed', err);
      }
    });
  }
}
