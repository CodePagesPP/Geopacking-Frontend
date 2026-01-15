import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  const expectedRoles = route.data?.['roles'] as string[];
  const userRoles = authService.getAuthorities();

  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

 
  const hasRole = expectedRoles.some(r => userRoles.includes(r));

  if (hasRole) {
    return true;
  }

  
  router.navigate(['/dashboard']); 
  return false;
};