import { Component, OnInit } from '@angular/core';
import { OrdenTrabajoEX } from '../../core/models/plan-prod-ex';
import { MaquinaService } from '../../core/services/machine.service';
import { ProductsService } from '../../core/services/products.service';
import { PlanProdExService } from '../../core/services/plan-prod-ex.service';
import { Maquina } from '../../core/models/machines.model';
import { ProductoEX } from '../../core/models/products.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-prod-ex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-prod-ex.component.html',
  styleUrls: ['./plan-prod-ex.component.css'],
})
export class PlanProdExComponent implements OnInit {
  mostrarModal: boolean = false;
  listaOrdenes: OrdenTrabajoEX[] = [];

  listaMaquinasExtrusoras: Maquina[] = [];
  listaProductosEX: ProductoEX[] = [];

  usuarioId: number = 1;
  usuarioname: string = 'Cargando...';
  nuevaOrden: OrdenTrabajoEX = {
    maquinaId: 0,
    productoId: 0,
    requerimientoKg: 0,
    creadaPorId: 1,
    creadaPorUsername: 'Cargando...'
  };

  constructor(
    private otService: PlanProdExService,
    private maquinaService: MaquinaService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    
    const token = localStorage.getItem('token');

    if (token) {
      try {
        
        const payload = JSON.parse(atob(token.split('.')[1]));

        console.log('🔍 LO QUE HAY DENTRO DEL TOKEN:', payload); 

        
        if (payload.id) {
          this.usuarioId = payload.id;
          this.usuarioname = payload.name;
        } else if (payload.userId) {
          this.usuarioId = payload.userId;
        } else {
          console.warn(
            '⚠️ El token no trae el ID explícitamente. Ver consola.'
          );
        }
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    }

    console.log('✅ ID DE USUARIO FINAL:', this.usuarioId);

    
    this.nuevaOrden.creadaPorId = this.usuarioId;
    this.nuevaOrden.creadaPorUsername = this.usuarioname;
    this.cargarDatosIniciales();
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  cargarDatosIniciales() {
    this.otService.listar().subscribe((data) => {
      this.listaOrdenes = data;
    });

    this.maquinaService.getMaquinasActivas().subscribe((maquinas) => {
      this.listaMaquinasExtrusoras = maquinas.filter(
        (m) => m.tipo === 'Extrusora'
      );
    });

    this.productsService.getAll('EX').subscribe((productos) => {
      this.listaProductosEX = productos;
    });
  }

  guardarOrden() {
    if (this.nuevaOrden.maquinaId === 0 || this.nuevaOrden.productoId === 0) {
      Swal.fire(
        'Atención',
        'Debes seleccionar una máquina y un producto.',
        'warning'
      );
      return;
    }
    if (this.nuevaOrden.requerimientoKg <= 0) {
      Swal.fire(
        'Atención',
        'El requerimiento debe ser mayor a 0 Kg.',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Generando Orden...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.otService.crear(this.nuevaOrden).subscribe({
      next: (res) => {
        Swal.fire({
          title: '¡Generada!',
          text: `Orden de Trabajo ${res.codigo} creada correctamente.`,
          icon: 'success',
          confirmButtonColor: '#3498db',
        });

        this.cargarDatosIniciales();
        this.cerrarModal();
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Hubo un problema al generar la orden.', 'error');
      },
    });
  }

  limpiarFormulario() {
    this.nuevaOrden = {
      maquinaId: 0,
      productoId: 0,
      requerimientoKg: 0,
      creadaPorId: 0,
    };
  }
}
