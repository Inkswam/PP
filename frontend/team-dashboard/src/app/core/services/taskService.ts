// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable }    from 'rxjs';
import { Task }          from '../models/TaskModel';
import { CreateTaskDto } from '../models/DTOs/create-task-dto.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private base = 'http://localhost:5084/api';

  constructor(private http: HttpClient) {}

  getTasksForTeam(teamId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.base}/tasks?teamId=${teamId}`, {
      withCredentials: true
    });
  }

  createTask(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.base}/tasks`, dto, {
      withCredentials: true
    });
  }

  updateTaskStatus(id: number, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.base}/tasks/${id}`, { status }, {
      withCredentials: true
    });
  }

}



