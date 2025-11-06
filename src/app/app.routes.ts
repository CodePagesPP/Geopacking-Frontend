import { Routes } from '@angular/router';
import { authenticatedGuardGuard } from './core/guards/authenticated-guard.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NavComponent } from './features/layouts/nav/nav.component';
import { NavOperatorComponent } from './features/layouts/nav-operator/nav-operator.component';
export const routes: Routes = [


  {
    path: '',
    title: '',
    component: NavComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] }
      },
      {
        path: 'machines',
        title: 'Machines',
        loadComponent: () => import('./features/machines/machines.component').then(m => m.MachinesComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] }
      },
      {

        path: 'tools',
        title: 'Tools',
        loadComponent: () => import('./features/tools/tools.component').then(m => m.ToolsComponent),
      },
      {
        path: 'workers',
        title: 'Workers',
        loadComponent: () => import('./features/workers/workers.component').then(m => m.WorkersComponent),

        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] }
      },
      {
        path: 'scrapp', // O llámalo 'reportes', como prefieras
        title: 'Reporte de Scrapp',
        loadComponent: () => import('./features/scrapp/scrapp.component').then(m => m.ScrappComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] } // Protegido para Admin
      },
    ]
  },
  {
    path: 'o',
    title: '',
    component: NavOperatorComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard-operator/dashboard-operator.component').then(m => m.DashboardOperatorComponent),
        canActivate: [roleGuard],
        data: { roles: ['OPERATOR_ACCESS'] }
      },
      {
        path: 'scrapp',
        title: 'Scrapp',
        loadComponent: () => import('./features/scrapp/scrapp.component').then(m => m.ScrappComponent),
        canActivate: [roleGuard],
        data: { roles: ['OPERATOR_ACCESS'] }
      }
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
