import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/core/services/userService';
import { FormsModule } from '@angular/forms';
import {SidebarComponent} from 'src/app/shared/components/sidebar/sidebar.component';
import {TopbarComponent} from 'src/app/shared/components/topbar/topbar.component';
import {RouterOutlet} from '@angular/router';
import {UserSidebarComponent} from 'src/app/features/user/user-sidebar.component';
import {UserTopbarComponent} from 'src/app/features/user/user-topbar.component';


@Component({
  standalone: true,
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  imports: [
    FormsModule,
    UserSidebarComponent,
    UserTopbarComponent,

  ],
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  user: User | null = null;
  originalUser: User | null = null;
  editing = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.getCurrentUser().subscribe(user => {
        this.user = user;
    });
  }

  toggleEdit() {
    if (this.editing) {
      this.saveUser();
    } else {
      this.editing = true;
    }
  }

  saveUser() {
    if (!this.user) return;
    this.userService.updateUser(this.user).subscribe({
      next: (data) => {
        alert('User data saved!');
        this.user = this.originalUser = { ...data };
        this.editing = false;
      },
      error: (e) => console.error(e)
    });
  }

  cancelEdit() {
    if (!this.originalUser) return;
    this.user = { ...this.originalUser };
    this.editing = false;
  }
}

