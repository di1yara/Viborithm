import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo-icon">🎵</span>
        <span class="logo-text">Viborithm</span>
      </div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/tracks" routerLinkActive="active">Tracks</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/saved" routerLinkActive="active">Saved</a>
          <a routerLink="/recommendations" routerLinkActive="active">For You</a>
          <a routerLink="/shazam" routerLinkActive="active">Shazam</a>
        }
      </div>
      <div class="nav-actions">
        @if (auth.isLoggedIn()) {
          <span class="username">👤 {{ auth.getUsername() }}</span>
          <button class="btn-logout" (click)="auth.logout()">Logout</button>
        } @else {
          <a routerLink="/login" class="btn-login">Login</a>
          <a routerLink="/register" class="btn-register">Sign Up</a>
        }
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}