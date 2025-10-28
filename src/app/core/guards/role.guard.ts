import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as string[];
  const userRoles = authService.getAuthorities();

  if (authService.isAuthenticated() && expectedRoles?.some(r => userRoles.includes(r))) {
    return true;
  }

 
  router.navigate(['/login']);
  return false;
};
