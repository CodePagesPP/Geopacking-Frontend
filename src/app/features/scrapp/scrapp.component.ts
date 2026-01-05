import { Component, inject, OnInit } from '@angular/core';
import {
  RegistroScrapp,
  ScrappRegistroDTO,
} from '../../core/models/scrapp.model';
import { Maquina, Molino } from '../../core/models/machines.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ScrappService } from '../../core/services/scrapp.service';
import { MaquinaService } from '../../core/services/machine.service';
import { AuthService } from '../../core/services/auth.service';
import { ToolService } from '../../core/services/tool.service';
import { catchError, Observable, of } from 'rxjs';
import { Origen, TypeScrapp } from '../../core/models/tool.model';

@Component({
  selector: 'app-scrapp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, FormsModule],
  templateUrl: './scrapp.component.html',
  styleUrl: './scrapp.component.css',
})
export class ScrappComponent implements OnInit {
  private fb = inject(FormBuilder);
  private scrappService = inject(ScrappService);
  private maquinaService = inject(MaquinaService);
  private authService = inject(AuthService);
  private toolService = inject(ToolService);
  public registros: RegistroScrapp[] = [];
  public maquinas: Maquina[] = [];
  public origenesDisponibles: Origen[] = [];
  public scrappForm: FormGroup;
  public isFormOpen = false;
  public isLoading = false;
  public errorMessage: string | null = null;
  public typeScrapps$: Observable<TypeScrapp[]>;
  public isAdmin = false;
  public totalPesoBruto = 0;
  public totalPesoNeto = 0;
  public paginacion = {
    page: 0,
    size: 10,
    totalItems: 0,
    totalPages: 0,
  };

  public filtros = {
    fechaInicio: '',
    fechaFin: '',
  };

  constructor() {
    this.scrappForm = this.fb.group({
      maquinaId: [null, Validators.required],
      origenId: [null, Validators.required],
      typeScrappId: [null, Validators.required],
      pesoBruto: [null, [Validators.required, Validators.min(0.1)]],
      pesoNeto: [null, [Validators.required, Validators.min(0.1)]],
      observaciones: ['']
    });
    this.typeScrapps$ = of([]);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ADMIN_ACCESS');
    this.loadMaquinas();
    this.loadRegistros();
    this.loadTypeScrapps();
  }

  loadMaquinas(): void {
    this.maquinaService.getMolinosActivos().subscribe({
      next: (data) => (this.maquinas = data),
      error: (err) => this.showError('Error al cargar máquinas'),
    });
  }

  loadTypeScrapps(): void {
    this.typeScrapps$ = this.toolService.getAll('TypeScrapp').pipe(
      catchError((err) => {
        return of([]);
      })
    );
  }

  onMaquinaChange(): void {
    const maquinaId = this.scrappForm.get('maquinaId')?.value;
    this.scrappForm.get('origenId')?.setValue(null);
    this.origenesDisponibles = [];

    if (!maquinaId) return;

    const maquinaSeleccionada = this.maquinas.find((m) => m.id == maquinaId);

    if (maquinaSeleccionada && maquinaSeleccionada.tipo === 'Molino') {
      const molino = maquinaSeleccionada as Molino;

      if (molino.origenes && molino.origenes.length > 0) {
        this.origenesDisponibles = molino.origenes;
      }
    }
  }

  loadRegistros(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const fechaInicio = this.filtros.fechaInicio || undefined;
    const fechaFin = this.filtros.fechaFin || undefined;

    this.scrappService
      .getReportePaginado(
        this.paginacion.page,
        this.paginacion.size,
        fechaInicio,
        fechaFin
      )
      .subscribe({
        next: (data) => {
          this.registros = data.registros;
          console.log(this.registros);
          this.totalPesoBruto = data.totalPesoBruto;
          this.totalPesoNeto = data.totalPesoNeto;

          this.paginacion.page = data.currentPage;
          this.paginacion.totalItems = data.totalItems;
          this.paginacion.totalPages = data.totalPages;

          this.isLoading = false;
        },
        error: (err) => this.handleLoadError(err, 'Error al cargar reporte'),
      });
  }

  onPageChange(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && nuevaPagina < this.paginacion.totalPages) {
      this.paginacion.page = nuevaPagina;
      this.loadRegistros();
    }
  }

  onAplicarFiltros(): void {
    this.paginacion.page = 0;
    this.loadRegistros();
  }

  onLimpiarFiltros(): void {
    this.filtros.fechaInicio = '';
    this.filtros.fechaFin = '';
    this.paginacion.page = 0;
    this.loadRegistros();
  }

  private handleLoadError(err: any, defaultMessage: string): void {
    if (err.status === 403) {
      this.showError('Acceso denegado. No tienes permisos.');
    } else {
      this.showError(err.error?.message || defaultMessage);
    }
    this.isLoading = false;
  }

  onSubmit(): void {
    if (this.scrappForm.invalid) {
      this.scrappForm.markAllAsTouched();
      return;
    }

    // Validar que peso neto no sea mayor que bruto
    const { pesoBruto, pesoNeto } = this.scrappForm.value;
    if (pesoNeto > pesoBruto) {
      this.showError('El Peso Neto no puede ser mayor que el Peso Bruto');
      return;
    }

    this.isLoading = true;
    const dto: ScrappRegistroDTO = this.scrappForm.value;

    this.scrappService.registrarScrapp(dto).subscribe({
      next: (nuevoRegistro) => {
        this.isLoading = false;
        this.closeForm();
        this.loadRegistros();
      },
      error: (err) => {
        this.showError(err.message || 'Error al registrar el pesaje');
        this.isLoading = false;
      },
    });
  }

  onImprimirReporteCompleto(): void {
    this.isLoading = true;
    this.scrappService
      .getReporteCompletoPdf(
        this.filtros.fechaInicio || undefined,
        this.filtros.fechaFin || undefined
      )
      .subscribe({
        next: (blob) => {
          const file = new Blob([blob], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
          this.isLoading = false;
        },
        error: (err) => {
          this.showError('Error al generar el reporte PDF completo');
          this.isLoading = false;
        },
      });
  }

  onImprimir(registroId: number): void {
    this.isLoading = true;
    this.scrappService.getEtiquetaPdf(registroId).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Error al generar la etiqueta PDF');
        this.isLoading = false;
      },
    });
  }

 

  openForm(): void {
    this.isFormOpen = true;
    this.errorMessage = null;
    this.scrappForm.reset();
  }

  closeForm(): void {
    this.isFormOpen = false;
  }

  showError(message: string): void {
    this.errorMessage = message;

    setTimeout(() => (this.errorMessage = null), 5000);
  }
}
