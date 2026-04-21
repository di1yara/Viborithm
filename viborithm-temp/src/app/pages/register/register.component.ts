import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = ''; email = ''; password = ''; confirmPassword = '';
  error = ''; success = ''; loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (!this.username || !this.email || !this.password) { this.error = 'Please fill in all fields'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match'; return; }
    this.loading = true;
    this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => { this.success = 'Account created! Redirecting...'; setTimeout(() => this.router.navigate(['/login']), 1500); },
      error: (err) => { this.error = err.error?.username?.[0] || 'Registration failed'; this.loading = false; }
    });
  }
}