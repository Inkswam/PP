// src/app/features/task-board/task-board.component.ts
import { Component, OnInit }           from '@angular/core';
import { CommonModule }                from '@angular/common';
import { CreateTaskModalComponent }    from 'src/app/features/task-board/task-modal/create-task-modal/create-task-modal.component';
import { TaskService }                 from 'src/app/core/services/taskService';
import { ActivatedRoute, RouterModule }from '@angular/router';
import { Task }                        from 'src/app/core/models/TaskModel';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, CreateTaskModalComponent, RouterModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  teamId!: number;
  awaiting:   Task[] = [];
  inProgress: Task[] = [];
  completed:  Task[] = [];
  showCreateModal = false;

  constructor(
    private svc: TaskService,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    this.teamId = +this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load() {
    this.svc.getTasksForTeam(this.teamId).subscribe(all => {
      this.awaiting   = all.filter(x => x.status === 'awaiting');
      this.inProgress = all.filter(x => x.status === 'in-progress');
      this.completed  = all.filter(x => x.status === 'completed');
    });
  }

  openCreateModal() { this.showCreateModal = true; }
  onModalClose()   { this.showCreateModal = false; }
  onTaskCreated(t: Task) {
    // push into right array
    if (t.status === 'awaiting')   this.awaiting.push(t);
    if (t.status === 'in-progress') this.inProgress.push(t);
    if (t.status === 'completed')  this.completed.push(t);
    this.showCreateModal = false;
  }
}
