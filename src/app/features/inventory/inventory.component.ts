import { Component, OnInit } from '@angular/core';
import { InventarioManualDTO, InventarioMovimiento, InventarioStockDTO, Motivo, Operacion } from '../../core/models/inventario.model';
import { InventoryService } from '../../core/services/inventory.service';
import { Page } from '../../core/models/page.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TypeScrapp } from '../../core/models/tool.model';
import { catchError, Observable, of } from 'rxjs';
import { ToolService } from '../../core/services/tool.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  stockActual: number = 0;
  movimientos: InventarioMovimiento[] = [];
  listaMotivos: Motivo[] = [];

  //Paginacion
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  typeScrappFiltroId: string = '';

  public typeScrapps$: Observable<TypeScrapp[]>; 

  // Para el modal de registro manual
  mostrarModal: boolean = false;
  OperacionModal: Operacion = Operacion.INGRESO;
  cantidadModal: number = 0;
  typeScrappModalId: number | null = null;
  motivoSeleccionadoId: number | null = null;
  nuevoMotivoNombre: string = '';
  notaMovimiento: string = '';

  public Operacion = Operacion;

  constructor(private inventarioService: InventoryService, private toolService: ToolService) {this.typeScrapps$ = of([]); }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarCatalogos();
  }

  cargarDatos(): void {
    this.obtenerStock();
    this.listarMovimientos();
  }

  cargarCatalogos(): void {
    this.typeScrapps$ = this.toolService.getAll('TypeScrapp').pipe(
      catchError(err => {
        console.error('Error al cargar tipos de scrapp', err);
        return of([]);
      })
    );

    this.inventarioService.obtenerMotivos().subscribe({
      next: (data) => this.listaMotivos = data,
      error: (err) => console.error('Error al cargar motivos', err)
    });
  }

  obtenerStock(): void {
    this.inventarioService.obtenerStockActual().subscribe({
      next: (data: InventarioStockDTO) => {
        this.stockActual = data.stockActual;
      },
      error: (err) => console.error('Error al obtener stock', err)
    });
  }

  listarMovimientos(): void {
    const typeId = this.typeScrappFiltroId ? Number(this.typeScrappFiltroId) : undefined;
    this.inventarioService.obtenerHistorial(this.currentPage, this.pageSize, this.fechaInicio || undefined, this.fechaFin || undefined, typeId)
      .subscribe({
        next: (page: Page<InventarioMovimiento>) => {
          this.movimientos = page.content;
          console.log(this.movimientos)
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
        },
        error: (err) => console.error('Error al listar movimientos', err)
      });
  }

  abrirModal(tipo: Operacion): void {
    this.OperacionModal = tipo;
    this.cantidadModal = 0;
    this.typeScrappModalId = null;
    this.motivoSeleccionadoId = null;
    this.nuevoMotivoNombre = '';
    this.notaMovimiento = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

    verificarNuevoMotivo(): void {
    if (this.motivoSeleccionadoId !== -1) {
      this.nuevoMotivoNombre = '';
    }
  }

  guardarMovimientoManual(): void {
    // Validaciones
    if (this.cantidadModal <= 0) {
      Swal.fire('Cantidad inválida', 'La cantidad debe ser mayor a 0.', 'warning');
      return;
    }
    if (!this.typeScrappModalId) {
      Swal.fire('Dato Faltante', 'Debe seleccionar un tipo de scrapp.', 'warning');
      return;
    }
    if (this.motivoSeleccionadoId === -1 && !this.nuevoMotivoNombre.trim()) {
      Swal.fire('Dato Faltante', 'Debe escribir el nombre del nuevo motivo.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Registrando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Construir el DTO completo
    const dto: InventarioManualDTO = {
      operacion: this.OperacionModal,
      cantidad: this.cantidadModal,
      typeScrappId: this.typeScrappModalId,
      motivoId: (this.motivoSeleccionadoId === -1) ? null : this.motivoSeleccionadoId,
      nuevoMotivo: (this.motivoSeleccionadoId === -1) ? this.nuevoMotivoNombre : null,
      nota: this.notaMovimiento
    };

    this.inventarioService.registrarMovimientoManual(dto).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos(); // Recarga la tabla y el stock
        this.cargarCatalogos(); // Recarga motivos por si se creó uno nuevo

        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: `El movimiento se registró correctamente.`,
          timer: 2500,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al registrar movimiento', err);
        Swal.fire('Error', 'No se pudo registrar el movimiento.', 'error');
      }
    });
  }

  verNota(nota: string | undefined, motivo: string | undefined): void {
    if (!nota) return;
    Swal.fire({
        title: motivo || 'Nota del Movimiento',
        text: nota,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3b82f6'
    });
  }

  // Métodos para paginación y filtros
  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.listarMovimientos();
  }

  filtrar(): void {
    this.currentPage = 0; // Reset a primera página al filtrar
    this.listarMovimientos();
  }
  
  limpiarFiltros(): void {
      this.fechaInicio = '';
      this.fechaFin = '';
      this.typeScrappFiltroId = '';
      this.filtrar();
  }
}
