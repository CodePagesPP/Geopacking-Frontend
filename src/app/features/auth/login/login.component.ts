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
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        
        localStorage.setItem('token', res.token);

        
        this.router.navigate(['/dashboard']);
        
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        
        this.error = 'Credenciales incorrectas o error de conexión.';
        this.loading = false;
      },
    });
  }
}
