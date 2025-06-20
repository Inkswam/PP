import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskBoardComponent } from './task-board.component';
import { TaskBoardRoutingModule } from './task-board-routing-module';
import {
  CreateTaskModalComponent
} from 'src/app/features/task-board/task-modal/create-task-modal/create-task-modal.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,        // для *ngIf, *ngFor
    TaskBoardRoutingModule,
    CreateTaskModalComponent,
    TaskBoardComponent
  ]
})
export class TaskBoardModule {}
