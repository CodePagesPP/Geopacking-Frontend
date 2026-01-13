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
  listaOrdenesFiltrada: OrdenTrabajoEX[] = [];
  usuarioId: number = 1;
  usuarioname: string = 'Cargando...';
  filtroMaquina: string = '';
  filtroProducto: string = '';
  filtroEstado: string = '';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';

  currentPage: number = 0; // Backend usa base 0
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

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
  ) { }

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (token) {
      try {

        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.id) {
          this.usuarioId = payload.id;
          this.usuarioname = payload.name;
        } else if (payload.userId) {
          this.usuarioId = payload.userId;
        } else {
          console.warn(
            'El token no trae el ID explícitamente. Ver consola.'
          );
        }
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    }

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
    this.cargarOrdenes();

    this.maquinaService.getMaquinasActivas().subscribe((maquinas) => {
      this.listaMaquinasExtrusoras = maquinas.filter((m) => m.tipo === 'Extrusora');
    });

    this.productsService.getAll('EX').subscribe((productos) => {
      this.listaProductosEX = productos;
    });
  }

  cargarOrdenes() {
    const filters = {
      maquinaId: this.filtroMaquina || null,
      productoId: this.filtroProducto || null,
      estado: this.filtroEstado || null,
      fechaDesde: this.filtroFechaDesde || null,
      fechaHasta: this.filtroFechaHasta || null
    };

    this.otService.listar(this.currentPage, this.pageSize, filters).subscribe({
      next: (data) => {
        this.listaOrdenes = data.content; 
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      error: (err) => console.error('Error cargando ordenes', err)
    });
  }


  aplicarFiltros() {
    this.currentPage = 0;
    this.cargarOrdenes();
  }

  limpiarFiltros() {
    this.filtroMaquina = '';
    this.filtroProducto = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.aplicarFiltros();
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.currentPage + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarOrdenes();
    }
  }

  guardarOrden() {
 
    if (!this.nuevaOrden.maquinaId || !this.nuevaOrden.productoId || this.nuevaOrden.requerimientoKg <= 0) {
      Swal.fire('Atención', 'Complete todos los campos obligatorios correctamente.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Procesando...',
      didOpen: () => Swal.showLoading()
    });

    if (this.nuevaOrden.id) {
      
      this.otService.editar(this.nuevaOrden.id, this.nuevaOrden).subscribe({
        next: (res) => {
          Swal.fire('Actualizado', `Orden ${res.codigo} actualizada correctamente.`, 'success');
          this.cerrarModal();
          this.cargarDatosIniciales();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar la orden.', 'error');
        }
      });

    } else {
      
      this.nuevaOrden.creadaPorId = this.usuarioId; 
      
      this.otService.crear(this.nuevaOrden).subscribe({
        next: (res) => {
          Swal.fire('Generada', `Orden ${res.codigo} creada correctamente.`, 'success');
          this.cerrarModal();
          this.cargarDatosIniciales();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear la orden.', 'error');
        }
      });
    }
  }


  eliminarOrden(ot: OrdenTrabajoEX) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la Orden ${ot.codigo}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#34495e',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
       
        this.otService.eliminar(ot.id!).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La orden ha sido eliminada.', 'success');
            this.cargarDatosIniciales(); 
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar la orden (quizás ya tiene avance).', 'error');
          }
        });

      }
    });
  }

  
  editarOrden(ot: OrdenTrabajoEX) {
   
    this.nuevaOrden = { ...ot };
    
    
    this.mostrarModal = true;
  }
  

  limpiarFormulario() {
    this.nuevaOrden = {
      id: undefined, 
      maquinaId: 0,
      productoId: 0,
      requerimientoKg: 0,
      creadaPorId: this.usuarioId, 
      creadaPorUsername: this.usuarioname
    };
  }
}
