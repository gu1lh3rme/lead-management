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
import { LeadService } from '../../core/services/lead.service';
import { LEAD_STATUSES, LeadStatus } from '../../core/models/lead.model';

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
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss']
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