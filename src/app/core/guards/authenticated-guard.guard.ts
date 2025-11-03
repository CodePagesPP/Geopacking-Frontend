import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authenticatedGuardGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
  const roles = authService.getAuthorities();

  const adminRoles = ['ADMIN_ACCESS'];

  if (roles.some(role => adminRoles.includes(role))) {
    router.navigate(['/dashboard']);
  } else if (roles.includes('OPERATOR_ACCESS')) {
    router.navigate(['/o/dashboard']);
  } else if (roles.includes('REPORT_ACCESS')) {
    router.navigate(['/r/dashboard']);
  }

  return false;
}

  return true;
};
