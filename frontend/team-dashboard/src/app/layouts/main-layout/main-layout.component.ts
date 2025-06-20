import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from 'src/app/shared/components/topbar/topbar.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  imports: [
    TopbarComponent,
    SidebarComponent,
    RouterOutlet
  ],
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.username = user.username;
    });
  }
}

