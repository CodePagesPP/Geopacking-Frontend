import { Component, OnInit } from '@angular/core';
import { InventarioMovimiento, InventarioStockDTO, Operacion } from '../../core/models/inventario.model';
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

  public Operacion = Operacion;

  constructor(private inventarioService: InventoryService, private toolService: ToolService) {this.typeScrapps$ = of([]); }

  ngOnInit(): void {
    this.cargarDatos();
    this.loadTypeScrapps();
  }

  cargarDatos(): void {
    this.obtenerStock();
    this.listarMovimientos();
    
  }

  obtenerStock(): void {
    this.inventarioService.obtenerStockActual().subscribe({
      next: (data: InventarioStockDTO) => {
        this.stockActual = data.stockActual;
      },
      error: (err) => console.error('Error al obtener stock', err)
    });
  }

  loadTypeScrapps(): void {
    this.typeScrapps$ = this.toolService.getAll('TypeScrapp').pipe(
      catchError(err => {
        console.error('Error al cargar tipos de scrapp', err);
        Swal.fire('Error', 'No se pudieron cargar los tipos de scrapp', 'error');
        return of([]);
      })
    );
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
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarMovimientoManual(): void {
    if (this.cantidadModal <= 0) {
      // Alerta de Error (Validación)
      Swal.fire({
        icon: 'error',
        title: 'Cantidad inválida',
        text: 'La cantidad debe ser mayor a 0.',
        confirmButtonColor: '#3b82f6' // Azul para mantener tu paleta
      });
      return;
    }

    if (!this.typeScrappModalId) {
      Swal.fire({
        icon: 'error',
        title: 'Dato Faltante',
        text: 'Debe seleccionar un tipo de scrapp.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Mostrar loading mientras se procesa (Opcional pero recomendado)
    Swal.fire({
      title: 'Registrando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.inventarioService.registrarMovimientoManual({
      operacion: this.OperacionModal,
      cantidad: this.cantidadModal,
      typeScrappId: this.typeScrappModalId
    }).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos(); // Recarga la tabla y el stock

        // Alerta de Éxito
        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: `El movimiento de ${this.OperacionModal.toLowerCase()} se registró correctamente.`,
          confirmButtonColor: '#10b981', // Verde éxito
          timer: 2500, // Se cierra sola después de 2.5s
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al registrar movimiento', err);
        // Alerta de Error (Backend)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el movimiento. Inténtalo de nuevo.',
          confirmButtonColor: '#ef4444' // Rojo error
        });
      }
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
