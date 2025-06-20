// src/app/shared/components/topbar/topbar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamService } from 'src/app/core/services/teamService';
import { CreateTeamModalComponent } from '../create-team-modal/create-team-modal';
import { Team } from 'src/app/core/models/team.model';
import { TeamsStoreService } from 'src/app/core/services/TeamsStoreService';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateTeamModalComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  showCreateModal = false;
  @Input() username: string = 'User'; // встановлюємо 'User' як значення за замовчуванням

  constructor(
    private teamService: TeamService,
    private teamsStore: TeamsStoreService
  ) {}

  toggleCreateModal(): void {
    this.showCreateModal = !this.showCreateModal;
  }

  onModalClose(): void {
    this.showCreateModal = false;
  }


  onCreateTeam(createdTeam: Team): void {

    this.teamsStore.add(createdTeam);
    this.showCreateModal = false;
  }

}
