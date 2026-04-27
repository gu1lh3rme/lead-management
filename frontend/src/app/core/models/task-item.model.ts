export type TaskStatus = 'Todo' | 'Doing' | 'Done';

export interface TaskItem {
  id: string;
  leadId: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItemCreateDto {
  title: string;
  dueDate: string;
  status: TaskStatus;
}

export interface TaskItemUpdateDto {
  title: string;
  dueDate: string;
  status: TaskStatus;
}

export const TASK_STATUSES: TaskStatus[] = ['Todo', 'Doing', 'Done'];
