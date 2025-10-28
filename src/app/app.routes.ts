import { Routes } from '@angular/router';
import { authenticatedGuardGuard } from './core/guards/authenticated-guard.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NavComponent } from './features/layouts/nav/nav.component';
export const routes: Routes = [


     {
    path: '',
    title: '',
    component: NavComponent,
    canActivate: [authGuard] ,
    children:[
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] }
      },
      ]
  },
     {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [authenticatedGuardGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }

];
