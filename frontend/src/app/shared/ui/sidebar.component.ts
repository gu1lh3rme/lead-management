import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule
  ],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <mat-icon class="logo-icon">people</mat-icon>
        <h2>Lead Manager</h2>
      </div>
      
      <nav class="sidebar-nav">
        <a mat-button 
           routerLink="/home" 
           routerLinkActive="active-link"
           class="nav-item">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </a>
        
        <a mat-button 
           routerLink="/leads" 
           routerLinkActive="active-link"
           class="nav-item">
          <mat-icon>people</mat-icon>
          <span>Leads</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: linear-gradient(180deg, #4caf50 0%, #388e3c 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: white;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      display: flex !important;
      align-items: center;
      gap: 16px;
      padding: 12px 20px !important;
      margin: 4px 12px !important;
      border-radius: 8px !important;
      color: rgba(255,255,255,0.9) !important;
      text-decoration: none;
      transition: all 0.2s ease;
      justify-content: flex-start !important;
      height: 48px;
      font-size: 14px !important;
    }

    .nav-item:hover {
      background-color: rgba(255,255,255,0.1) !important;
      color: white !important;
    }

    .nav-item.active-link {
      background-color: rgba(255,255,255,0.15) !important;
      color: white !important;
      font-weight: 600;
    }

    .nav-item mat-icon {
      color: inherit;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-item span {
      font-weight: inherit;
    }
  `]
})
export class SidebarComponent {
  private router = inject(Router);
}