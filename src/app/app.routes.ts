import { Routes } from '@angular/router';
import { authenticatedGuardGuard } from './core/guards/authenticated-guard.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NavComponent } from './features/layouts/nav/nav.component';
import { NavOperatorComponent } from './features/layouts/nav-operator/nav-operator.component';

export const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    canActivate: [authGuard],
    children: [
      // --- RUTAS PRINCIPALES ---
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] },
      },
      {
        path: 'products',
        title: 'Productos',
        loadComponent: () =>
          import('./features/products/products.component').then(
            (m) => m.ProductsComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] },
      },
      {
        path: 'clients',
        title: 'Clientes',
        loadComponent: () =>
          import('./features/clients/clients.component').then(
            (m) => m.ClientesComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] },
      },

      // --- NUEVA RUTA: CONFIGURACIÓN (/config/...) ---
      {
        path: 'config',
        canActivate: [roleGuard], // Protegemos todo el bloque
        data: { roles: ['ADMIN_ACCESS'] },
        children: [
          {
            path: 'maquinas', // URL: /config/maquinas
            title: 'Configuración Máquinas',
            loadComponent: () =>
              import('./features/machines/machines.component').then(
                (m) => m.MachinesComponent
              ),
          },
          {
            path: 'materiales', // URL: /config/materiales (Antes 'tools')
            title: 'Configuración Materiales',
            loadComponent: () =>
              import('./features/tools/tools.component').then(
                (m) => m.ToolsComponent
              ),
          },
          {
            path: 'usuarios', // URL: /config/usuarios (Antes 'workers')
            title: 'Configuración Usuarios',
            loadComponent: () =>
              import('./features/workers/workers.component').then(
                (m) => m.WorkersComponent
              ),
          },
          {
            path: 'roles', // URL: /config/roles
            title: 'Roles y Accesos',
            // Si aún no tienes componente de roles, redirige o usa uno temporal
            redirectTo: 'usuarios',
          },
        ],
      },

      // --- NUEVA RUTA: INVENTARIO (/inventario/...) ---
      {
        path: 'inventario',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] },
        children: [
          {
            path: 'insumos',
            title: 'Insumos',
            loadComponent: () =>
              import('./features/insumos/insumos.component').then(
                (m) => m.InsumosComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },
        ],
      },

      // --- NUEVA RUTA: PRODUCCIÓN (/produccion/...) ---
      {
        path: 'produccion',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] },
        children: [
          {
            path: 'planProduccionEX',
            title: 'Plan de Producción EX',
            loadComponent: () =>
              import('./features/plan-prod-ex/plan-prod-ex.component').then(
                (m) => m.PlanProdExComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },

          {
            path: 'ordenProduccionEX',
            title: 'Orden de Producción EX',
            loadComponent: () =>
              import('./features/orden-prod-ex/orden-prod-ex.component').then(
                (m) => m.OrdenProdEXComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },

          {
            path: 'registroDeMolienda',
            title: 'Registro de Molienda',
            loadComponent: () =>
              import('./features/scrapp/scrapp.component').then(
                (m) => m.ScrappComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },
          
          {
            path: 'listadoRegistroMolienda',
            title: 'Listado de Registro de Molienda',
            loadComponent: () =>
              import('./features/inventory/inventory.component').then(
                (m) => m.InventoryComponent
              ),
          },
        ],
      },

      // --- REPORTES ---
      {
        path: '', // Este lo dejaste fuera de producción en el menú antiguo, lo mantengo aquí si quieres
        title: '',
        loadComponent: () =>
          import('./features/scrapp/scrapp.component').then(
            (m) => m.ScrappComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS'] },
      },
    ],
  },

  // --- RUTAS OPERADOR ---
  {
    path: 'o',
    component: NavOperatorComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import(
            './features/dashboard-operator/dashboard-operator.component'
          ).then((m) => m.DashboardOperatorComponent),
        canActivate: [roleGuard],
        data: { roles: ['OPERATOR_ACCESS'] },
      },
      {
        path: 'scrapp',
        title: 'Scrapp',
        loadComponent: () =>
          import('./features/scrapp/scrapp.component').then(
            (m) => m.ScrappComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['OPERATOR_ACCESS'] },
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [authenticatedGuardGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];