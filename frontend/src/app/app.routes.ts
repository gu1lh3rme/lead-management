import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'leads',
    loadComponent: () => import('./pages/leads/lead-list.component').then(m => m.LeadListComponent)
  },
  {
    path: 'leads/new',
    loadComponent: () => import('./pages/leads/lead-form.component').then(m => m.LeadFormComponent)
  },
  {
    path: 'leads/:id',
    loadComponent: () => import('./pages/lead-detail/lead-detail.component').then(m => m.LeadDetailComponent)
  },
  {
    path: 'leads/:id/edit',
    loadComponent: () => import('./pages/leads/lead-form.component').then(m => m.LeadFormComponent)
  },
  { path: '**', redirectTo: '/home' }
];
