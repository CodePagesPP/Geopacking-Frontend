import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumoService } from '../../core/services/insumo.service';
import { ToolService } from '../../core/services/tool.service';
import { InventoryService } from '../../core/services/inventory.service';
import { CreateInsumoDTO, InsumoRegistroDTO } from '../../core/models/insumo.model';
import { Motivo, Operacion } from '../../core/models/inventario.model';
import Swal from 'sweetalert2';
import { Material } from '../../core/models/tool.model';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css'
})
export class InsumosComponent implements OnInit {

  public Operacion = Operacion;
  private fb = inject(FormBuilder);
  private insumoService = inject(InsumoService);
  private toolService = inject(ToolService);
  private inventoryService = inject(InventoryService);

  registros: InsumoRegistroDTO[] = [];
  materiales: Material[] = [];
  motivos: Motivo[] = [];

  stockActual: number = 0;
  isFormOpen: boolean = false;
  mostrarInputNuevoMotivo: boolean = false;
  tipoOperacion: Operacion = Operacion.INGRESO;

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  filtros = {
    fechaInicio: '',
    fechaFin: '',
    materialId: null as number | null
  };

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      materialId: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0.01)]],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      motivoSelect: [null],
      nuevoMotivoText: [''],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarCatalogos();
  }

  cargarDatos():void {
    this.insumoService.listar(
      this.currentPage,
      this.pageSize,
      this.filtros.fechaInicio || undefined,
      this.filtros.fechaFin || undefined,
      this.filtros.materialId || undefined
    ).subscribe({
      next: (page) => {
        this.registros = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
      },
      error: (err) => console.error('Error al listar insumos', err)
    });
  }

  cargarCatalogos(): void {
    this.toolService.getAll('Material').subscribe({
      next: (data) => this.materiales = data,
      error: (err) => console.error('Error al cargar materiales', err)
    });

    this.inventoryService.obtenerMotivos().subscribe({
      next: (data) => this.motivos = data,
      error: (err) => console.error('Error al cargar motivos', err)
    });
  }

  consultarStock(materialId: number): void {
    if (!materialId) {
      this.stockActual = 0;
      return;
    }

    this.insumoService.obtenerStock(materialId).subscribe({
      next: (val) => this.stockActual = val,
      error: () => this.stockActual = 0
    });
  }

  onMaterialFilterChange(event: any): void {
    const id = event.target.value;
    this.filtros.materialId = (id && id !== 'null') ? Number(id) : null;

    if (this.filtros.materialId) {
      this.consultarStock(this.filtros.materialId);
    } else {
      this.stockActual = 0;
    }
    this.filtrar();
  }

  abrirModal(operacion: Operacion): void {
    this.tipoOperacion = operacion;
    this.isFormOpen = true;
    this.mostrarInputNuevoMotivo = false;

    this.form.reset({
      fecha: new Date().toISOString().substring(0, 10),
      cantidad: null,
      materialId: null,
      motivoSelect: null,
      nuevoMotivoText: '',
      observaciones: ''
    });
    this.form.get('nuevoMotivoText')?.clearValidators();
    this.form.get('nuevoMotivoText')?.updateValueAndValidity();
  }

  cerrarModal(): void {
    this.isFormOpen = false;
  }

  onMotivoChange(event: any): void {
    const seleccion = this.form.get('motivoSelect')?.value;

    if(seleccion === 'NUEVO') {
      this.mostrarInputNuevoMotivo = true;
      this.form.get('nuevoMotivoText')?.setValidators([Validators.required]);
    } else {
      this.mostrarInputNuevoMotivo = false;
      this.form.get('nuevoMotivoText')?.clearValidators();
      this.form.get('nuevoMotivoText')?.setValue('');
    }
    this.form.get('nuevoMotivoText')?.updateValueAndValidity();
  }
  
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Datos incompletos', 'Complete los campos obligatorios.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Registrando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const val = this.form.value;

    const dto: CreateInsumoDTO = {
      materialId: Number(val.materialId),
      cantidad: val.cantidad,
      fecha: val.fecha,
      operacion: this.tipoOperacion,
      motivoId: null,
      nuevoMotivo: null,
      observaciones: val.observaciones
    };

    if (this.mostrarInputNuevoMotivo) {
      dto.nuevoMotivo = val.nuevoMotivoText;
    } else {
      dto.motivoId = (val.motivoSelect && val.motivoSelect !== 'NUEVO') ? Number(val.motivoSelect) : null;
    }

    this.insumoService.registrar(dto).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos();
        this.cargarCatalogos(); 
        
        if (this.filtros.materialId === dto.materialId) {
            this.consultarStock(dto.materialId);
        }

        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: `Movimiento registrado correctamente.`,
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo registrar el movimiento.', 'error');
      }
    });
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.cargarDatos();
  }

  filtrar(): void {
    this.currentPage = 0;
    this.cargarDatos();
  }

  limpiarFiltros(): void {
    this.filtros = { fechaInicio: '', fechaFin: '', materialId: null };
    this.stockActual = 0;
    this.filtrar();
  }

  verObservacion(nota: string | undefined): void {
    if (!nota) return;
    
    Swal.fire({
      title: 'Nota / Observación',
      text: nota,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3498db'
    });
  }
}
