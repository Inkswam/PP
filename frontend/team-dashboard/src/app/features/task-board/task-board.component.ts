import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskModalComponent } from 'src/app/features/task-board/task-modal/create-task-modal/create-task-modal.component';
import { TaskService } from 'src/app/core/services/taskService';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Task } from 'src/app/core/models/TaskModel';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, CreateTaskModalComponent, RouterModule, DragDropModule],
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

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id as 'awaiting' | 'in-progress' | 'completed';
      task.status = newStatus;

      this.svc.updateTaskStatus(task.id!, newStatus).subscribe();
    }
  }

  openCreateModal() { this.showCreateModal = true; }
  onModalClose()    { this.showCreateModal = false; }
  onTaskCreated(t: Task) {
    this.awaiting.push(t);
    this.showCreateModal = false;
  }
}
