import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthRequest } from '../../../core/models/auth.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: AuthRequest = { dni: '', password: '' };
   error: string | null = null;
   
   constructor(private authService: AuthService, private router: Router) {}

   onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

        const roles = this.authService.getAuthorities();

        const adminRoles = ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'];

        if (roles.some(role => adminRoles.includes(role))) {
          this.router.navigate(['/dashboard']);
        } else if (roles.includes('CLIENT_ACCESS')) {
          this.router.navigate(['/c/dashboard']);
        } else if (roles.includes('INSTRUCTOR_ACCESS')) {
          this.router.navigate(['/i/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.error = err.message;
      },
    });
  }
}
