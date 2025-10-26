import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'Home',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '**',
        redirectTo: 'Home'
    }

];
