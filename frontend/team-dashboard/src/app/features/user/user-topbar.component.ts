import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-topbar',
  standalone: true,
  template: `
    <header class="user-topbar">
      <span class="app-title">Orbitae</span>
      <button class="btn-dashboard" (click)="goToDashboard()">Dashboard</button>
    </header>
  `,
  styles: [`
    .user-topbar {
      height: 60px;
      background-color: #1e2d3d;
      color: white;
      display: flex;
      align-items: center;
      padding: 0 20px;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #2d3f50;
    }
    .app-title {
      font-weight: 700;
      font-size: 20px;
      color: #ffffff;
    }
    .btn-dashboard {
      background: transparent;
      border: 2px solid #4a5f72;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-dashboard:hover {
      border-color: #6c63ff;
      color: #6c63ff;
    }
  `]
})
export class UserTopbarComponent {
  constructor(private router: Router) {}
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
