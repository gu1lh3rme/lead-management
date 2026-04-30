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
import { LeadService } from '../../core/services/lead.service';
import { Lead, LeadStatus, LEAD_STATUSES } from '../../core/models/lead.model';

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
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
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