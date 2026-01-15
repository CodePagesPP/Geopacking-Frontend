import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import { OrdenTrabajoTF } from '../../core/models/plan-prod-tf';
import Swal from 'sweetalert2';
import { MaquinaService } from '../../core/services/machine.service';
import { ProductsService } from '../../core/services/products.service';
import { Maquina } from '../../core/models/machines.model';
import { ProductoTF } from '../../core/models/products.model';

@Component({
  selector: 'app-plan-prod-tf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-prod-tf.component.html',
  styleUrl: './plan-prod-tf.component.css',
})
export class PlanProdTfComponent implements OnInit {
  mostrarModal: boolean = false;
  
  // CAMBIO: listaOrdenes ahora contendrá solo la página actual traída del backend
  listaOrdenes: OrdenTrabajoTF[] = []; 
  
  // Variables de Paginación
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  // Filtros
  filtroMaquina: string = '';
  filtroProducto: string = '';
  filtroEstado: string = '';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';

  // Listas Auxiliares
  listaMaquinasTermoformadoras: Maquina[] = [];
  listaProductosTF: ProductoTF[] = [];

  usuarioId: number = 1;
  usuarioname: string = 'Cargando...';

  esEdicion: boolean = false;
  idOrdenAEditar: number | null = null;

  nuevaOrden: OrdenTrabajoTF = {
    maquinaId: 0,
    productoId: 0,
    requerimientoKg: 0,
    creadaPorId: 1,
    creadaPorUsername: 'Cargando...',
  };

  productoBaseVisual: string = '';

  constructor(
    private otService: PlanProdTfService,
    private maquinaService: MaquinaService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioDelToken();
    this.cargarListasAuxiliares(); // Cargar combos (maquinas, productos)
    this.cargarDatos(); // Cargar tabla paginada
  }

  obtenerUsuarioDelToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          this.usuarioId = payload.id;
          this.usuarioname = payload.name;
        } else if (payload.userId) {
          this.usuarioId = payload.userId;
        }
      } catch (e) {
        console.error('Error token', e);
      }
    }
    this.nuevaOrden.creadaPorId = this.usuarioId;
    this.nuevaOrden.creadaPorUsername = this.usuarioname;
  }

  // CAMBIO: Separar la carga de listas auxiliares de la carga de datos de la tabla
  cargarListasAuxiliares() {
    this.maquinaService.getMaquinasActivas().subscribe((maquinas) => {
      this.listaMaquinasTermoformadoras = maquinas.filter((m) => m.tipo === 'Termoformadora');
    });

    this.productsService.getAll('TF').subscribe((productos) => {
      this.listaProductosTF = productos;
    });
  }

  // CAMBIO: Método principal para cargar datos paginados y filtrados desde backend
  cargarDatos() {
    const filters = {
      maquinaId: this.filtroMaquina || null,
      productoId: this.filtroProducto || null,
      estado: this.filtroEstado || null,
      fechaDesde: this.filtroFechaDesde || null,
      fechaHasta: this.filtroFechaHasta || null
    };

    this.otService.listar(this.currentPage, this.pageSize, filters).subscribe({
      next: (data) => {
        this.listaOrdenes = data.content; // Asignamos el contenido de la página actual
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      error: (e) => {
        console.error('Error cargando datos', e);
        // Opcional: Mostrar alerta de error
      }
    });
  }

  // CAMBIO: Al aplicar filtros, reseteamos a la página 1 y recargamos desde backend
  aplicarFiltros() {
    this.currentPage = 0;
    this.cargarDatos();
  }

  // CAMBIO: Limpiar filtros y recargar
  limpiarFiltros() {
    this.filtroMaquina = '';
    this.filtroProducto = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.aplicarFiltros();
  }

  // CAMBIO: Método para manejar el cambio de página
  cambiarPagina(delta: number) {
    const nuevaPagina = this.currentPage + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarDatos();
    }
  }

  // ... (El resto de métodos: abrirModal, cerrarModal, editarOrden, guardarOrden, etc. SE MANTIENEN IGUAL) ...

  abrirModal() {
    this.esEdicion = false;
    this.idOrdenAEditar = null;
    this.limpiarFormulario();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  editarOrden(ot: OrdenTrabajoTF) {
    this.esEdicion = true;
    this.idOrdenAEditar = ot.id!;

    this.nuevaOrden = {
      ...ot,
      maquinaId: Number(ot.maquinaId),
      productoId: Number(ot.productoId)
    };

    this.onProductoChange();
    this.mostrarModal = true;
  }

  onProductoChange() {
    const prod = this.listaProductosTF.find(
      (p) => p.id == this.nuevaOrden.productoId
    );

    if (prod && prod.productoBase) {
      this.productoBaseVisual = prod.productoBase.name;
    } else {
      this.productoBaseVisual = 'N/A';
    }
  }

  guardarOrden() {
    if (this.nuevaOrden.maquinaId === 0 || this.nuevaOrden.productoId === 0) {
      Swal.fire('Atención', 'Seleccione máquina y producto.', 'warning');
      return;
    }
    if (this.nuevaOrden.requerimientoKg <= 0) {
      Swal.fire('Atención', 'El requerimiento debe ser mayor a 0 Kg.', 'warning');
      return;
    }

    Swal.fire({ title: 'Procesando...', didOpen: () => Swal.showLoading() });

    if (this.esEdicion && this.idOrdenAEditar) {
      this.otService.editar(this.idOrdenAEditar, this.nuevaOrden).subscribe({
        next: (res) => {
          Swal.fire('Actualizado', `Orden ${res.codigo} actualizada correctamente.`, 'success');
          this.cargarDatos(); // Recargar tabla paginada
          this.cerrarModal();
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'No se pudo actualizar la orden.', 'error');
        }
      });
    } else {
      this.otService.crear(this.nuevaOrden).subscribe({
        next: (res) => {
          Swal.fire('¡Generada!', `OT ${res.codigo} creada.`, 'success');
          this.cargarDatos(); // Recargar tabla paginada
          this.cerrarModal();
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'No se pudo generar la orden.', 'error');
        },
      });
    }
  }

  eliminarOrden(id: number, codigo: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la orden ${codigo}. No podrás revertirlo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.otService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La orden ha sido eliminada.', 'success');
            this.cargarDatos(); // Recargar tabla paginada
          },
          error: (e) => {
            console.error(e);
            Swal.fire('Error', 'No se pudo eliminar (quizás ya tiene producción registrada).', 'error');
          }
        });
      }
    });
  }

  limpiarFormulario() {
    this.nuevaOrden = {
      maquinaId: 0,
      productoId: 0,
      requerimientoKg: 0,
      creadaPorId: this.usuarioId,
      creadaPorUsername: this.usuarioname,
    };
    this.productoBaseVisual = '';
  }
}