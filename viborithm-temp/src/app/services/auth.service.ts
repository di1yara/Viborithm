// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthTokens } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string }) {
    return this.http.post(`${this.base}/register/`, data);
  }

  login(username: string, password: string) {
    return this.http.post<AuthTokens>(`${this.base}/token/`, { username, password }).pipe(
      tap(tokens => {
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);
      })
    );
  }

  logout() {
    const refresh = localStorage.getItem('refresh');
    this.http.post(`${this.base}/logout/`, { refresh }).subscribe();
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    return localStorage.getItem('access');
  }

  getUsername(): string {
    try {
      const token = this.getToken();
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || '';
    } catch {
      return '';
    }
  }
}