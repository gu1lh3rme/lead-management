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
import { TaskItemService } from '../../core/services/task-item.service';
import { TaskItem, TASK_STATUSES, TASK_STATUS_LABELS, TaskStatus } from '../../core/models/task-item.model';

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
  templateUrl: './lead-tasks.component.html',
  styleUrls: ['./lead-tasks.component.scss']
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

  protected getTaskStatusLabel(status: TaskStatus): string {
    return TASK_STATUS_LABELS[status];
  }

  protected taskForm = this.fb.group({
    title: ['', Validators.required],
    dueDate: [new Date()],
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
        this.snackBar.open('Erro ao carregar tarefas', 'Fechar', { duration: 3000 });
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
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      status: task.status,
    });
  }

  protected onSubmitTask(): void {
    if (this.taskForm.invalid) return;
    this.saving = true;
    const formValue = this.taskForm.value;
    const dto = {
      title: formValue.title!,
      dueDate: formValue.dueDate ? (formValue.dueDate as Date).toISOString() : undefined,
      status: formValue.status as TaskStatus,
    };

    const request$ = this.editingTask
      ? this.taskService.update(this.leadId, this.editingTask.id, dto)
      : this.taskService.create(this.leadId, dto);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.editingTask ? 'Tarefa atualizada' : 'Tarefa adicionada',
          'Fechar', { duration: 3000 }
        );
        this.saving = false;
        this.toggleForm();
        this.loadTasks();
      },
      error: () => {
        this.snackBar.open('Erro ao salvar tarefa', 'Fechar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  protected onDeleteTask(task: TaskItem): void {
    if (!confirm(`Excluir tarefa "${task.title}"?`)) return;
    this.taskService.delete(this.leadId, task.id).subscribe({
      next: () => {
        this.snackBar.open('Tarefa excluída', 'Fechar', { duration: 3000 });
        this.loadTasks();
      },
      error: () => this.snackBar.open('Erro ao excluir tarefa', 'Fechar', { duration: 3000 })
    });
  }
}