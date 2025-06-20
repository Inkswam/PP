import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-topbar',
  standalone: true,
  template: `
    <header class="user-topbar">
      <h1>User Topbar</h1>
      <button class="btn-dashboard" (click)="goToDashboard()">Dashboard</button>
    </header>
  `,
  styles: [`
    .user-topbar {
      height: 60px !important;
      background-color: #000000 !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 20px !important;
      font-size: 20px !important;
      justify-content: space-between !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    .user-topbar h1 {
      margin: 0 !important;
    }

    .user-topbar .btn-dashboard {
      background-color: #007bff !important;
      border: none !important;
      color: white !important;
      padding: 6px 12px !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      font-size: 16px !important;
    }

    .user-topbar .btn-dashboard:hover {
      background-color: #0056b3 !important;
    }

  `]
})
export class UserTopbarComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
