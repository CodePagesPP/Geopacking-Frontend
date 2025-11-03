import { Component, inject } from '@angular/core';
import { RegistroScrapp, ScrappRegistroDTO } from '../../core/models/scrapp.model';
import { Maquina } from '../../core/models/machines.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ScrappService } from '../../core/services/scrapp.service';
import { MaquinaService } from '../../core/services/machine.service';

@Component({
  selector: 'app-scrapp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './scrapp.component.html',
  styleUrl: './scrapp.component.css'
})
export class ScrappComponent {
  private fb = inject(FormBuilder);
  private scrappService = inject(ScrappService);
  private maquinaService = inject(MaquinaService);
  public registros: RegistroScrapp[] = [];
  public maquinas: Maquina[] = [];
  public scrappForm: FormGroup;
  public isFormOpen = false;
  public isLoading = false;
  public errorMessage: string | null = null;

  constructor() {
    
    // Inicializar el formulario
    this.scrappForm = this.fb.group({
      maquinaId: [null, Validators.required],
      pesoBruto: [null, [Validators.required, Validators.min(0.1)]],
      pesoNeto: [null, [Validators.required, Validators.min(0.1)]]
    });
  }

  ngOnInit(): void {
    this.loadMaquinas();
    this.loadRegistros();
  }

  loadMaquinas(): void {
    this.maquinaService.getMaquinasActivas().subscribe({
      next: (data) => this.maquinas = data,
      error: (err) => this.showError('Error al cargar máquinas')
    });
  }

  loadRegistros(): void {
    this.isLoading = true;
    this.scrappService.getRegistros().subscribe({
      next: (data) => {
        this.registros = data.sort((a, b) => b.id - a.id); // Mostrar últimos primero
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Error al cargar registros');
        this.isLoading = false;
      }
    });
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
      }
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
      }
    });
  }

  // --- Helpers de UI ---

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
    
    setTimeout(() => this.errorMessage = null, 5000);
  }
}
