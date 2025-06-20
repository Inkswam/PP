// src/app/features/dashboard/components/main-area/main-area.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from 'src/app/core/services/teamService';
import { Team } from 'src/app/core/models/team.model';

@Component({
  selector: 'app-main-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-area.html',
  styleUrls: ['./main-area.scss']
})
export class MainAreaComponent implements OnInit {
  teams: Team[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getAllTeams().subscribe({
      next: (data: Team[]) => {
        this.teams = data;
      },
      error: (err: any) => {
        console.error('Failed to load teams', err);
      }
    });
  }
}
