// src/app/features/task-board/task-modal/create-task-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { TaskService }  from 'src/app/core/services/taskService';
import { Task }         from 'src/app/core/models/TaskModel';
import { CreateTaskDto }from 'src/app/core/models/DTOs/create-task-dto.model';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent {
  @Input()  teamId!: number;
  @Output() close   = new EventEmitter<void>();
  @Output() created = new EventEmitter<Task>();

  title: string = '';
  status: 'awaiting' | 'in-progress' | 'completed' = 'awaiting';

  constructor(private svc: TaskService) {}

  save() {
    if (!this.title.trim()) return;
    const dto: CreateTaskDto = {
      title:  this.title.trim(),
      status: this.status,
      teamId: this.teamId
    };
    this.svc.createTask(dto).subscribe(t => {
      this.created.emit(t);
    });
  }
}
