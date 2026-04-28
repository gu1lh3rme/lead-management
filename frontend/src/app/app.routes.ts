import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/leads', pathMatch: 'full' },
  {
    path: 'leads',
    loadComponent: () => import('./features/leads/list/lead-list.component').then(m => m.LeadListComponent)
  },
  {
    path: 'leads/new',
    loadComponent: () => import('./features/leads/form/lead-form.component').then(m => m.LeadFormComponent)
  },
  {
    path: 'leads/:id',
    loadComponent: () => import('./features/leads/detail/lead-detail.component').then(m => m.LeadDetailComponent)
  },
  {
    path: 'leads/:id/edit',
    loadComponent: () => import('./features/leads/form/lead-form.component').then(m => m.LeadFormComponent)
  },
  { path: '**', redirectTo: '/leads' }
];
