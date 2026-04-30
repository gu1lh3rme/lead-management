import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadService } from '../../core/services/lead.service';
import { Lead } from '../../core/models/lead.model';
import { LeadTasksComponent } from '../../shared/ui/lead-tasks.component';

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
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss']
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