//
// // src/app/shared/components/sidebar/sidebar.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { TeamService } from 'src/app/core/services/teamService';
// import { Team } from 'src/app/core/models/team.model';
// import { TeamsStoreService } from 'src/app/core/services/TeamsStoreService';
// import { AuthService } from 'src/app/core/services/auth.service'; // Припускаю, що є AuthService
//
// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.scss']
// })
// export class SidebarComponent implements OnInit {
//   teams: Team[] = [];
//   currentUserId: number | null = null;
//
//   constructor(
//     private teamService: TeamService,
//     private teamsStore: TeamsStoreService,
//     private router: Router,
//     private authService: AuthService // Додано для отримання ID поточного користувача
//   ) {}
//
//   ngOnInit(): void {
//     // Отримуємо ID поточного користувача
//     this.currentUserId = this.authService.getCurrentUserId();
//
//     // Завантажуємо команди з сервера
//     this.loadTeams();
//
//     // Підписуємося на оновлення в сторі
//     this.teamsStore.teams$.subscribe((ts: Team[]) => this.teams = ts);
//   }
//
//   loadTeams(): void {
//     this.teamService.getAllTeams().subscribe((teams: Team[]) => {
//       this.teamsStore.setAll(teams);
//     });
//   }
//
//   onTeamClick(team: Team): void {
//     this.router.navigate(['teams', team.id, 'tasks']);
//   }
//
//   trackByTeamId(_: number, team: Team): number | undefined {
//     return team.id;
//   }
//
//   // Перевіряємо чи є користувач власником команди
//   isTeamOwner(team: Team): boolean {
//     return this.currentUserId === team.ownerId;
//   }
//
//   // Тільки власник може видалити команду
//   onDeleteTeam(event: MouseEvent, team: Team): void {
//     if (!team.id || !this.isTeamOwner(team)) return;
//
//     event.stopPropagation();
//
//     if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
//       this.teamService.deleteTeam(team.id).subscribe({
//         next: () => {
//           this.teams = this.teams.filter(t => t.id !== team.id);
//           this.teamsStore.setAll(this.teams);
//         },
//         error: (error) => {
//           console.error('Error deleting team:', error);
//           alert('Failed to delete team. You might not have permission.');
//         }
//       });
//     }
//   }
// }


// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TeamService } from 'src/app/core/services/teamService';
import { Team } from 'src/app/core/models/team.model';
import { TeamsStoreService } from 'src/app/core/services/TeamsStoreService';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService, User } from 'src/app/core/services/userService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  teams: Team[] = [];
  currentUserId: number | null = null;
  teamParticipants: { [teamId: number]: User[] } = {}; // Зберігаємо учасників для кожної команди
  expandedTeams: Set<number> = new Set(); // Для відстеження розгорнутих команд

  constructor(
    private teamService: TeamService,
    private teamsStore: TeamsStoreService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Отримуємо ID поточного користувача
    this.currentUserId = this.authService.getCurrentUserId();

    // Завантажуємо команди з сервера
    this.loadTeams();

    // Підписуємося на оновлення в сторі
    this.teamsStore.teams$.subscribe((ts: Team[]) => {
      this.teams = ts;
      this.loadParticipantsForAllTeams();
    });
  }

  loadTeams(): void {
    this.teamService.getAllTeams().subscribe((teams: Team[]) => {
      this.teamsStore.setAll(teams);
    });
  }

  // Завантажуємо учасників для всіх команд
  loadParticipantsForAllTeams(): void {
    if (this.teams.length === 0) return;

    const participantRequests = this.teams.map(team =>
      this.teamService.getTeamParticipants(team.id!)
    );

    forkJoin(participantRequests).subscribe({
      next: (participantsArrays) => {
        this.teams.forEach((team, index) => {
          if (team.id) {
            this.teamParticipants[team.id] = participantsArrays[index];
          }
        });
      },
      error: (error) => {
        console.error('Error loading team participants:', error);
      }
    });
  }

  onTeamClick(team: Team): void {
    this.router.navigate(['teams', team.id, 'tasks']);
  }

  // Перемикаємо розгортання команди для показу учасників
  toggleTeamExpansion(event: MouseEvent, teamId: number): void {
    event.stopPropagation();

    if (this.expandedTeams.has(teamId)) {
      this.expandedTeams.delete(teamId);
    } else {
      this.expandedTeams.add(teamId);
    }
  }

  // Перевіряємо чи команда розгорнута
  isTeamExpanded(teamId: number): boolean {
    return this.expandedTeams.has(teamId);
  }

  // Отримуємо учасників команди
  getTeamParticipants(teamId: number): User[] {
    return this.teamParticipants[teamId] || [];
  }

  trackByTeamId(_: number, team: Team): number | undefined {
    return team.id;
  }

  trackByUserId(_: number, user: User): number | undefined {
    return user.id;
  }

  // Перевіряємо чи є користувач власником команди
  isTeamOwner(team: Team): boolean {
    return this.currentUserId === team.ownerId;
  }

  // Тільки власник може видалити команду
  onDeleteTeam(event: MouseEvent, team: Team): void {
    if (!team.id || !this.isTeamOwner(team)) return;

    event.stopPropagation();

    if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
      this.teamService.deleteTeam(team.id).subscribe({
        next: () => {
          this.teams = this.teams.filter(t => t.id !== team.id);
          this.teamsStore.setAll(this.teams);
          // Очищаємо дані про учасників видаленої команди
          if (team.id) {
            delete this.teamParticipants[team.id];
            this.expandedTeams.delete(team.id);
          }
        },
        error: (error) => {
          console.error('Error deleting team:', error);
          alert('Failed to delete team. You might not have permission.');
        }
      });
    }
  }

  // Видалити учасника з команди (тільки для власника)
  removeParticipant(event: MouseEvent, teamId: number, userId: number): void {
    event.stopPropagation();

    if (!this.isTeamOwner(this.teams.find(t => t.id === teamId)!)) return;

    if (confirm('Are you sure you want to remove this participant?')) {
      this.teamService.removeParticipant(teamId, userId).subscribe({
        next: () => {
          // Оновлюємо список учасників
          if (this.teamParticipants[teamId]) {
            this.teamParticipants[teamId] = this.teamParticipants[teamId]
              .filter(p => p.id !== userId);
          }
        },
        error: (error) => {
          console.error('Error removing participant:', error);
          alert('Failed to remove participant.');
        }
      });
    }
  }
}
