import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authenticatedGuardGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
  const roles = authService.getAuthorities();

  const adminRoles = ['ADMIN_ACCESS', 'MANAGER_ACCESS', 'STAFF_ACCESS'];

  if (roles.some(role => adminRoles.includes(role))) {
    router.navigate(['/dashboard']);
  } else if (roles.includes('CLIENT_ACCESS')) {
    router.navigate(['/c/dashboard']);
  } else if (roles.includes('INSTRUCTOR_ACCESS')) {
    router.navigate(['/i/dashboard']);
  }

  return false;
}

  return true;
};
