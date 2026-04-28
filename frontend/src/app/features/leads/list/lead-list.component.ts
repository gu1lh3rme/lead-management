import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LeadService } from '../../../core/services/lead.service';
import { Lead, LeadStatus, LEAD_STATUSES } from '../../../core/models/lead.model';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Leads</h1>
        <button mat-raised-button color="primary" (click)="onCreateLead()">
          <mat-icon>add</mat-icon> New Lead
        </button>
      </div>

      <div class="filters" [formGroup]="filterForm">
        <mat-form-field appearance="outline">
          <mat-label>Search by name or email</mat-label>
          <input matInput formControlName="search" placeholder="Type to search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Filter by status</mat-label>
          <mat-select formControlName="status">
            <mat-option [value]="''">All statuses</mat-option>
            @for (s of leadStatuses; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      @if (leadService.loading()) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else {
        <table mat-table [dataSource]="leadService.leads()" class="full-width">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let lead">{{ lead.name }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let lead">{{ lead.email }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let lead">
              <span [class]="'status-badge status-' + lead.status.toLowerCase()">{{ lead.status }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let lead">{{ lead.createdAt | date:'short' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let lead">
              <button mat-icon-button matTooltip="View Details" (click)="onViewDetail(lead)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Edit" (click)="onEditLead(lead)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="onDeleteLead(lead)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row"></tr>
        </table>

        @if (leadService.leads().length === 0) {
          <div class="empty-state">
            <mat-icon>person_search</mat-icon>
            <p>No leads found. Create your first lead!</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .filters { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .filters mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .loading-container { display: flex; justify-content: center; padding: 48px; }
    .empty-state { text-align: center; padding: 48px; color: #999; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .clickable-row:hover { background: #f5f5f5; cursor: pointer; }
    .status-badge {
      padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;
    }
    .status-new { background: #e3f2fd; color: #1565c0; }
    .status-qualified { background: #f3e5f5; color: #6a1b9a; }
    .status-won { background: #e8f5e9; color: #2e7d32; }
    .status-lost { background: #ffebee; color: #c62828; }
  `]
})
export class LeadListComponent implements OnInit {
  protected leadService = inject(LeadService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  protected leadStatuses = LEAD_STATUSES;
  protected displayedColumns = ['name', 'email', 'status', 'createdAt', 'actions'];

  protected filterForm = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<LeadStatus | ''>(''),
  });

  ngOnInit(): void {
    this.loadLeads();
    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.loadLeads());
  }

  private loadLeads(): void {
    const { search, status } = this.filterForm.value;
    this.leadService.getAll(search || undefined, (status as LeadStatus) || undefined)
      .subscribe({
        error: () => this.snackBar.open('Error loading leads', 'Close', { duration: 3000 })
      });
  }

  protected onViewDetail(lead: Lead): void {
    this.router.navigate(['/leads', lead.id]);
  }

  protected onCreateLead(): void {
    this.router.navigate(['/leads/new']);
  }

  protected onEditLead(lead: Lead): void {
    this.router.navigate(['/leads', lead.id, 'edit']);
  }

  protected onDeleteLead(lead: Lead): void {
    if (!confirm(`Delete lead "${lead.name}"?`)) return;
    this.leadService.delete(lead.id).subscribe({
      next: () => {
        this.snackBar.open('Lead deleted successfully', 'Close', { duration: 3000 });
        this.loadLeads();
      },
      error: () => this.snackBar.open('Error deleting lead', 'Close', { duration: 3000 })
    });
  }
}
