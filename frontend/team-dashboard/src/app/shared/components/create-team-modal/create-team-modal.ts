import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from 'src/app/core/services/userService';
import { TeamService } from 'src/app/core/services/teamService';
import { CreateTeamRequest } from 'src/app/core/models/team.model';
import { Team } from 'src/app/core/models/team.model';

@Component({
  selector: 'app-create-team-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-team-modal.html',
  styleUrls: ['./create-team-modal.scss']
})
export class CreateTeamModalComponent implements OnInit {
  teamName = '';
  selectedUsers: User[] = [];  // вибрані користувачі
  availableUsers: User[] = [];  // всі доступні користувачі
  isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<Team>();

  constructor(
    private userService: UserService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.availableUsers = users;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  toggleUser(user: User): void {
    const index = this.selectedUsers.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  onCreate(): void {
    if (!this.teamName.trim() || this.selectedUsers.length === 0) {
      return;
    }

    // Перетворюємо вибраних користувачів в список імен
    const participants = this.selectedUsers.map(user => user.id!.toString());

    const teamData: CreateTeamRequest = {
      name: this.teamName.trim(),
      participants: participants
    };

    this.teamService.createTeam(teamData).subscribe({
      next: (team: Team) => {
        this.create.emit(team);
        this.onClose();
      },
      error: (error: any) => {
        console.error('Error creating team:', error);
        // Тут можна додати показ помилки користувачу
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
