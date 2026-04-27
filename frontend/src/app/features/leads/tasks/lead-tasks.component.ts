import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TaskItemService } from '../../../core/services/task-item.service';
import { TaskItem, TASK_STATUSES, TaskStatus } from '../../../core/models/task-item.model';

@Component({
  selector: 'app-lead-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  template: `
    <div class="tasks-section">
      <div class="tasks-header">
        <h2>Tasks</h2>
        <button mat-raised-button color="accent" (click)="toggleForm()">
          <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
          {{ showForm ? 'Cancel' : 'Add Task' }}
        </button>
      </div>

      @if (showForm) {
        <div class="task-form">
          <form [formGroup]="taskForm" (ngSubmit)="onSubmitTask()" class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Task title">
              @if (taskForm.get('title')?.hasError('required') && taskForm.get('title')?.touched) {
                <mat-error>Title is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Due Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                @for (s of taskStatuses; track s) {
                  <mat-option [value]="s">{{ s }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid || saving">
              {{ editingTask ? 'Update' : 'Add Task' }}
            </button>
          </form>
        </div>
      }

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      } @else {
        <table mat-table [dataSource]="tasks" class="full-width">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let task">{{ task.title }}</td>
          </ng-container>

          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let task">{{ task.dueDate | date:'shortDate' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let task">
              <span [class]="'task-badge task-' + task.status.toLowerCase()">{{ task.status }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let task">
              <button mat-icon-button (click)="onEditTask(task)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDeleteTask(task)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (tasks.length === 0) {
          <div class="empty-state">
            <p>No tasks yet. Add your first task!</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .tasks-section { padding: 24px 0; }
    .tasks-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .tasks-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
    .task-form { background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
    .form-row { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 160px; }
    .full-width { width: 100%; }
    .loading-container { display: flex; justify-content: center; padding: 24px; }
    .empty-state { text-align: center; padding: 24px; color: #999; }
    .task-badge { padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 500; }
    .task-todo { background: #fff3e0; color: #e65100; }
    .task-doing { background: #e3f2fd; color: #1565c0; }
    .task-done { background: #e8f5e9; color: #2e7d32; }
  `]
})
export class LeadTasksComponent implements OnInit {
  @Input({ required: true }) leadId!: string;

  private taskService = inject(TaskItemService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  protected tasks: TaskItem[] = [];
  protected taskStatuses = TASK_STATUSES;
  protected displayedColumns = ['title', 'dueDate', 'status', 'actions'];
  protected loading = true;
  protected showForm = false;
  protected saving = false;
  protected editingTask?: TaskItem;

  protected taskForm = this.fb.group({
    title: ['', Validators.required],
    dueDate: [new Date(), Validators.required],
    status: ['Todo' as TaskStatus, Validators.required],
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.loading = true;
    this.taskService.getByLeadId(this.leadId).subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  protected toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingTask = undefined;
      this.taskForm.reset({ dueDate: new Date(), status: 'Todo' });
    }
  }

  protected onEditTask(task: TaskItem): void {
    this.editingTask = task;
    this.showForm = true;
    this.taskForm.patchValue({
      title: task.title,
      dueDate: new Date(task.dueDate),
      status: task.status,
    });
  }

  protected onSubmitTask(): void {
    if (this.taskForm.invalid) return;
    this.saving = true;
    const formValue = this.taskForm.value;
    const dto = {
      title: formValue.title!,
      dueDate: (formValue.dueDate as Date).toISOString(),
      status: formValue.status as TaskStatus,
    };

    const request$ = this.editingTask
      ? this.taskService.update(this.leadId, this.editingTask.id, dto)
      : this.taskService.create(this.leadId, dto);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.editingTask ? 'Task updated' : 'Task added',
          'Close', { duration: 3000 }
        );
        this.saving = false;
        this.toggleForm();
        this.loadTasks();
      },
      error: () => {
        this.snackBar.open('Error saving task', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  protected onDeleteTask(task: TaskItem): void {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    this.taskService.delete(this.leadId, task.id).subscribe({
      next: () => {
        this.snackBar.open('Task deleted', 'Close', { duration: 3000 });
        this.loadTasks();
      },
      error: () => this.snackBar.open('Error deleting task', 'Close', { duration: 3000 })
    });
  }
}
