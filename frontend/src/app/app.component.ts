import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>people</mat-icon>
      <span style="margin-left: 8px; font-size: 20px; font-weight: 600;">Lead Management</span>
      <span style="flex: 1;"></span>
      <button mat-button routerLink="/leads">
        <mat-icon>list</mat-icon> Leads
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    mat-toolbar { box-shadow: 0 2px 4px rgba(0,0,0,.2); }
  `]
})
export class AppComponent {}
