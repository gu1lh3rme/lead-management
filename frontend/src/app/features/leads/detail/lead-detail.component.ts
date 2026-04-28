import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadService } from '../../../core/services/lead.service';
import { Lead } from '../../../core/models/lead.model';
import { LeadTasksComponent } from '../tasks/lead-tasks.component';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    LeadTasksComponent,
  ],
  template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Lead Details</h1>
        <button mat-raised-button color="primary" (click)="onEdit()">
          <mat-icon>edit</mat-icon> Edit
        </button>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else if (lead) {
        <div class="detail-card">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name</span>
              <span class="value">{{ lead.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ lead.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status</span>
              <span [class]="'status-badge status-' + lead.status.toLowerCase()">{{ lead.status }}</span>
            </div>
            <div class="info-item">
              <span class="label">Created</span>
              <span class="value">{{ lead.createdAt | date:'medium' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Last Updated</span>
              <span class="value">{{ lead.updatedAt | date:'medium' }}</span>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <app-lead-tasks [leadId]="lead.id"></app-lead-tasks>
      }
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 900px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; flex: 1; }
    .loading-container { display: flex; justify-content: center; padding: 48px; }
    .detail-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.08); padding: 24px; margin-bottom: 24px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .label { font-size: 12px; color: #666; font-weight: 500; text-transform: uppercase; }
    .value { font-size: 16px; color: #333; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; display: inline-block; }
    .status-new { background: #e3f2fd; color: #1565c0; }
    .status-qualified { background: #f3e5f5; color: #6a1b9a; }
    .status-won { background: #e8f5e9; color: #2e7d32; }
    .status-lost { background: #ffebee; color: #c62828; }
  `]
})
export class LeadDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private leadService = inject(LeadService);
  private snackBar = inject(MatSnackBar);

  protected lead?: Lead;
  protected loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.leadService.getById(id).subscribe({
      next: lead => {
        this.lead = lead;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading lead', 'Close', { duration: 3000 });
        this.goBack();
      }
    });
  }

  protected onEdit(): void {
    this.router.navigate(['/leads', this.lead?.id, 'edit']);
  }

  protected goBack(): void {
    this.router.navigate(['/leads']);
  }
}
