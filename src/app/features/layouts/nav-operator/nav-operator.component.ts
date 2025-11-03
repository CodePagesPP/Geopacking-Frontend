import { Component } from '@angular/core';
import { User } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-nav-operator',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './nav-operator.component.html',
  styleUrl: './nav-operator.component.css'
})
export class NavOperatorComponent {
user: User | null = null;
  showTestWarning: boolean = false; 
  authorities: string[] = [];
  showConfig = false;
  menuOpen = false;

  toggleConfig() {
    this.showConfig = !this.showConfig;
  }

  constructor(
    
    private authService: AuthService
  ) {}

   ngOnInit(): void {
    this.getUserInfo();
    this.authorities = this.authService.getAuthorities();
  }



  toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

  hasRole(role: string): boolean {
    return this.authorities.includes(role);
  }

  getUserInfo(): void {

    this.authService.getUserInfo().subscribe({
      next: (data) => {
      
        this.user = data; 
      },
      error: (err) => {
        
        this.showTestWarning = true; 
      }
    });
  }

  logout(): void {
    this.authService.logout();
    
  }



  activeOption: string = '';
  setActive(option: string) {
    this.activeOption = option;
  }
}
