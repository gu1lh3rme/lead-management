import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadService } from '../../../core/services/lead.service';
import { LEAD_STATUSES, LeadStatus } from '../../../core/models/lead.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditing ? 'Edit Lead' : 'New Lead' }}</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Lead name">
              @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                <mat-error>Name is required</mat-error>
              }
              @if (form.get('name')?.hasError('minlength') && form.get('name')?.touched) {
                <mat-error>Name must be at least 2 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="lead@example.com">
              @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                @for (s of leadStatuses; track s) {
                  <mat-option [value]="s">{{ s }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
                @if (saving) {
                  <mat-spinner diameter="20" style="display: inline-block; margin-right: 8px;"></mat-spinner>
                }
                {{ isEditing ? 'Save Changes' : 'Create Lead' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 600px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .form { display: flex; flex-direction: column; gap: 16px; padding: 16px 0; }
    .full-width { width: 100%; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class LeadFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private leadService = inject(LeadService);
  private snackBar = inject(MatSnackBar);

  protected leadStatuses = LEAD_STATUSES;
  protected isEditing = false;
  protected saving = false;
  private leadId?: string;

  protected form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    status: ['New' as LeadStatus, Validators.required],
  });

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditing = !!this.leadId && this.leadId !== 'new';

    if (this.isEditing && this.leadId) {
      this.leadService.getById(this.leadId).subscribe({
        next: lead => this.form.patchValue(lead),
        error: () => {
          this.snackBar.open('Error loading lead', 'Close', { duration: 3000 });
          this.goBack();
        }
      });
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const dto = this.form.value as any;

    const request$ = this.isEditing && this.leadId
      ? this.leadService.update(this.leadId, dto)
      : this.leadService.create(dto);

    request$.subscribe({
      next: lead => {
        this.snackBar.open(
          this.isEditing ? 'Lead updated successfully' : 'Lead created successfully',
          'Close', { duration: 3000 }
        );
        this.router.navigate(['/leads', lead.id]);
      },
      error: () => {
        this.snackBar.open('Error saving lead', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/leads']);
  }
}
