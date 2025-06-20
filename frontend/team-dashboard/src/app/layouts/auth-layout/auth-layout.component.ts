import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  template: `
    <div class="auth-container">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent { }
