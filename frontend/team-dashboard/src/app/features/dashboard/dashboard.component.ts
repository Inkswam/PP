import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from 'src/app/core/services/teamService';
import { TaskService } from 'src/app/core/services/taskService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  teamsCount = 0;
  tasksCount = 0;
  membersCount = 0;

  constructor(
    private teamService: TeamService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.teamService.getAllTeams().subscribe(teams => {
      this.teamsCount = teams.length;
      const memberIds = new Set<string>();
      teams.forEach(t => {
        t.participants?.forEach(p => memberIds.add(p));
      });
      this.membersCount = memberIds.size;

      let total = 0;
      let loaded = 0;
      if (teams.length === 0) return;
      teams.forEach(team => {
        this.taskService.getTasksForTeam(team.id!).subscribe(tasks => {
          total += tasks.length;
          loaded++;
          if (loaded === teams.length) {
            this.tasksCount = total;
          }
        });
      });
    });
  }
}
