// src/app/core/models/create-task-dto.model.ts
export interface CreateTaskDto {
  title:  string;
  status: 'awaiting' | 'in-progress' | 'completed';
  teamId: number;
}
