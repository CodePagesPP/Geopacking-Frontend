import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

// Definimos la estructura de un Item del menú
interface MenuItem {
  label: string;
  icon: string;
  route?: string; // Si tiene ruta, navega
  children?: MenuItem[]; // Si tiene hijos, es un desplegable
  expanded?: boolean; // Para controlar si está abierto o cerrado
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'], // Nota: Corregí styleUrl a styleUrls (plural es estándar, aunque singular funciona en v17+)
})
export class NavComponent implements OnInit {
  user: User | null = null;
  authorities: string[] = [];
  menuOpen = false;

  // --- NUEVA ESTRUCTURA DEL MENÚ BASADA EN EL EXCEL ---
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard_customize',
      route: '/dashboard',
    },
    {
      label: 'Producción',
      icon: 'factory', // Icono de fábrica
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
            },
            {
              label: 'Órdenes de Producción EX',
              icon: 'assignment',
              route: '/produccion/ordenProduccionEX',
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
              route: '/produccion/termoformado/plan',
            },
            {
              label: 'Órdenes de Producción TF',
              icon: 'assignment',
              route: '/produccion/termoformado/ordenes',
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
            },
            {
              label: 'Listado de Registro de Molienda',
              icon: 'list_alt',
              route: '/produccion/listadoRegistroMolienda',
            },
          ],
        },
      ],
    },
    {
      label: 'Productos',
      icon: 'token',
      route: '/products', // Listado general
    },
    {
      label: 'Clientes',
      icon: 'people_outline',
      route: '/clients',
    },
    {
      label: 'Compras',
      icon: 'shopping_cart',
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
      children: [
        {
          label: 'Productos Terminados',
          icon: 'check_circle',
          route: '/inventario/terminados',
        },
        {
          label: 'Productos en Tránsito',
          icon: 'local_shipping',
          expanded: false,
          // Aquí simulo las pestañas como submenús para acceso directo
          children: [
            {
              label: 'Productos EX',
              icon: 'arrow_right',
              route: '/inventario/transito/ex',
            },
            {
              label: 'Productos TF',
              icon: 'arrow_right',
              route: '/inventario/transito/tf',
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
      children: [
        { label: 'General', icon: 'analytics', route: '/reportes/general' },
      ],
    },
    {
      label: 'Configuración',
      icon: 'settings_applications',
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.authorities = this.authService.getAuthorities();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Función para abrir/cerrar submenús
  toggleSubMenu(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
