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
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS', 'AYUDANTE_ACCESS'] },
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

      {
        path: 'config',
        canActivate: [roleGuard], // Protegemos todo el bloque
        data: { roles: ['ADMIN_ACCESS'] },
        children: [
          {
            path: 'maquinas',
            title: 'Configuración Máquinas',
            loadComponent: () =>
              import('./features/machines/machines.component').then(
                (m) => m.MachinesComponent
              ),
          },
          {
            path: 'materiales',
            title: 'Configuración Materiales',
            loadComponent: () =>
              import('./features/tools/tools.component').then(
                (m) => m.ToolsComponent
              ),
          },
          {
            path: 'usuarios',
            title: 'Configuración Usuarios',
            loadComponent: () =>
              import('./features/workers/workers.component').then(
                (m) => m.WorkersComponent
              ),
          },
          {
            path: 'roles',
            title: 'Roles y Accesos',
            redirectTo: 'usuarios',
          },
        ],
      },

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
          {
            path: 'productos-terminados',
            title: 'Productos Terminados',
            loadComponent: () =>
              import('./features/prods-terminados/prods-terminados.component').then(
                (m) => m.ProdsTerminadosComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },
          {
            path: 'productosTransitoEX',
            title: 'Productos en Transito EX',
            loadComponent: () =>
              import('./features/prods-tran-ex/prods-tran-ex.component').then(
                (m) => m.ProdsTranExComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },
          {
            path: 'productosTransitoTF',
            title: 'Productos en Transito TF',
            loadComponent: () =>
              import('./features/prods-tran-tf/prods-tran-tf.component').then(
                (m) => m.ProdsTranTfComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          }
        ],
      },

      {
        path: 'produccion',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS', 'AYUDANTE_ACCESS'] },
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
            data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS'] },
          },

          {
            path: 'planProduccionTF',
            title: 'Plan de Producción TF',
            loadComponent: () =>
              import('./features/plan-prod-tf/plan-prod-tf.component').then(
                (m) => m.PlanProdTfComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },

          {
            path: 'ordenProduccionTF',
            title: 'Orden de Producción TF',
            loadComponent: () =>
              import('./features/orden-prod-tf/orden-prod-tf.component').then(
                (m) => m.OrdenProdTfComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS'] },
          },

          {
            path: 'registroDeMolienda',
            title: 'Registro de Molienda',
            loadComponent: () =>
              import('./features/scrapp/scrapp.component').then(
                (m) => m.ScrappComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS',  'AYUDANTE_ACCESS'] },
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
        path: 'reportes',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS'] },
        children: [
          {
            path: 'historial-bobinas',
            title: 'Historial Bobinas',
            loadComponent: () =>
              import('./features/historial-bobina/historial-bobina.component').then(
                (m) => m.HistorialBobinaComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS'] },
          },
          {
            path: 'historial-cajas',
            title: 'Historial Cajas',
            loadComponent: () =>
              import('./features/historial-cajas/historial-cajas.component').then(
                (m) => m.HistorialCajasComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS', 'OPERATOR_ACCESS'] },
          },
          {
            path: 'historial-salida',
            title: 'Historial Salida Productos Terminados TF',
            loadComponent: () =>
              import('./features/historial-salida/historial-salida.component').then(
                (m) => m.HistorialSalidaComponent
              ),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN_ACCESS'] },
          },
        ],
      },
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