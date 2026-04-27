import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TaskItem, TaskItemCreateDto, TaskItemUpdateDto } from '../models/task-item.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskItemService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leads`;

  getByLeadId(leadId: string): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/${leadId}/tasks`);
  }

  create(leadId: string, dto: TaskItemCreateDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.apiUrl}/${leadId}/tasks`, dto);
  }

  update(leadId: string, taskId: string, dto: TaskItemUpdateDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${leadId}/tasks/${taskId}`, dto);
  }

  delete(leadId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${leadId}/tasks/${taskId}`);
  }
}
