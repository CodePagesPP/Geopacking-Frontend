import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from '../../../core/models/auth.model'; 
import { AuthService } from '../../../core/services/auth.service';


interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  roles?: string[]; 
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: User | null = null;
  userRoles: string[] = []; 
  menuOpen = false;
  menuItems: MenuItem[] = []; 


  readonly ADMIN = 'ADMIN_ACCESS';
  readonly OPERADOR = 'OPERATOR_ACCESS';
  readonly AYUDANTE = 'AYUDANTE_ACCESS';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
   
    this.authService.getUserInfo().subscribe((data) => (this.user = data));
    this.userRoles = this.authService.getAuthorities();

    
    this.menuItems = this.buildMenu();
  }


  private getMasterMenu(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'dashboard_customize',
        route: '/dashboard',
        roles: [this.ADMIN, this.OPERADOR, this.AYUDANTE], 
      },
      {
        label: 'Producción',
        icon: 'factory',
        roles: [this.ADMIN, this.OPERADOR, this.AYUDANTE],
        children: [
          {
            label: 'Extrusión',
            icon: 'precision_manufacturing',
            expanded: false,
            children: [
              {
                label: 'Plan de Producción EX',
                icon: 'description',
                route: '/produccion/planProduccionEX',
                roles: [this.ADMIN], 
              },
              {
                label: 'Órdenes de Producción EX',
                icon: 'assignment',
                route: '/produccion/ordenProduccionEX',
                roles: [this.ADMIN, this.OPERADOR], 
              },
            ],
          },
          {
            label: 'Termoformado',
            icon: 'layers',
            expanded: false,
            children: [
              {
                label: 'Plan de Producción TF',
                icon: 'description',
                route: '/produccion/planProduccionTF',
                roles: [this.ADMIN],
              },
              {
                label: 'Órdenes de Producción TF',
                icon: 'assignment',
                route: '/produccion/ordenProduccionTF',
                roles: [this.ADMIN, this.OPERADOR], 
              },
            ],
          },
          {
            label: 'Molino',
            icon: 'recycling',
            expanded: false,
            children: [
              {
                label: 'Registro de Molienda',
                icon: 'edit_note',
                route: '/produccion/registroDeMolienda',
                roles: [this.ADMIN, this.OPERADOR, this.AYUDANTE], 
              },
              {
                label: 'Listado de Registro',
                icon: 'list_alt',
                route: '/produccion/listadoRegistroMolienda',
                roles: [this.ADMIN],
              },
            ],
          },
        ],
      },
      {
        label: 'Productos',
        icon: 'token',
        route: '/products',
        roles: [this.ADMIN], 
      },
      {
        label: 'Clientes',
        icon: 'people_outline',
        route: '/clients',
        roles: [this.ADMIN], 
      },
      {
        label: 'Compras',
        icon: 'shopping_cart',
        roles: [this.ADMIN], 
        children: [
          {
            label: 'Órdenes de Compra',
            icon: 'receipt_long',
            route: '/compras/ordenes',
          },
          {
            label: 'Registrar Compra',
            icon: 'add_shopping_cart',
            route: '/compras/registro',
          },
          { label: 'Proveedores', icon: 'store', route: '/compras/proveedores' },
        ],
      },
      {
        label: 'Inventario',
        icon: 'inventory_2',
        roles: [this.ADMIN], 
        children: [
          {
            label: 'Productos Terminados',
            icon: 'check_circle',
            route: '/inventario/productos-terminados',
          },
          {
            label: 'Productos en Tránsito',
            icon: 'local_shipping',
            expanded: false,
            children: [
              {
                label: 'Productos EX',
                icon: 'arrow_right',
                route: '/inventario/productosTransitoEX',
              },
              {
                label: 'Productos TF',
                icon: 'arrow_right',
                route: '/inventario/productosTransitoTF',
              },
            ],
          },
          { label: 'Insumos', icon: 'science', route: '/inventario/insumos' },
          {
            label: 'Material de Empaque',
            icon: 'inventory',
            route: '/inventario/empaque',
          },
          {
            label: 'Consumibles',
            icon: 'handyman',
            route: '/inventario/consumibles',
          },
          {
            label: 'Suministros',
            icon: 'power',
            route: '/inventario/suministros',
          },
          {
            label: 'Devoluciones',
            icon: 'assignment_return',
            route: '/inventario/devoluciones',
          },
        ],
      },
      {
        label: 'Reportes',
        icon: 'bar_chart',
        roles: [this.ADMIN, this.OPERADOR], 
        children: [
          {
            label: 'General',
            icon: 'analytics',
            route: '/reportes/general',
            roles: [this.ADMIN],
          },
          {
            label: 'Historial Bobinas',
            icon: 'analytics',
            route: '/reportes/historial-bobinas',
            roles: [this.ADMIN, this.OPERADOR],
          },
          {
            label: 'Historial Cajas',
            icon: 'analytics',
            route: '/reportes/historial-cajas',
            roles: [this.ADMIN, this.OPERADOR],
          },
          {
            label: 'Historial Salidas TF',
            icon: 'analytics',
            route: '/reportes/historial-salida',
            roles: [this.ADMIN], 
          },
        ],
      },
      {
        label: 'Configuración',
        icon: 'settings_applications',
        roles: [this.ADMIN], 
        children: [
          {
            label: 'Productos',
            icon: 'settings',
            route: '/config/productos',
          },
          {
            label: 'Máquinas',
            icon: 'precision_manufacturing',
            route: '/config/maquinas',
          },
          { label: 'Materiales', icon: 'build', route: '/config/materiales' },
          { label: 'Usuarios', icon: 'group', route: '/config/usuarios' },
          {
            label: 'Roles y Accesos',
            icon: 'admin_panel_settings',
            route: '/config/roles',
          },
        ],
      },
    ];
  }

  

  buildMenu(): MenuItem[] {
    const master = this.getMasterMenu();
    return this.filterNodes(master);
  }

  
  private filterNodes(items: MenuItem[]): MenuItem[] {
    return items
      .filter((item) => this.hasPermission(item)) 
      .map((item) => {
        
        if (item.children) {
          
          return { ...item, children: this.filterNodes(item.children) };
        }
        return item;
      })
      .filter((item) => {
        
        if (item.children && item.children.length === 0 && !item.route) {
          return false;
        }
        return true;
      });
  }

  
  private hasPermission(item: MenuItem): boolean {
    
    if (!item.roles || item.roles.length === 0) return true;
    
    
    return item.roles.some((r) => this.userRoles.includes(r));
  }

  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSubMenu(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}