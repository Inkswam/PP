import { Component } from '@angular/core';
import {AuthService} from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  template: `
    <aside class="user-sidebar">
      <button (click)="logout()" class="logout-btn">
        Logout
      </button>
    </aside>
  `,
  styles: [`
    .user-sidebar {
      width: 220px;
      background-color: #1e2d3d;
      height: calc(100vh - 60px);
      position: fixed;
      top: 60px;
      left: 0;
      border-right: 1px solid #2d3f50;
      display: flex;
      justify-content: center;
      align-items: start;
      padding-top: 20px;
    }
    .logout-btn {
      background: linear-gradient(135deg, #ff6b6b, #c62828);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      transition: opacity 0.2s;
    }
    .logout-btn:hover {
      opacity: 0.9;
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
