import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Extrusora, Maquina, Molino, Termoformadora, TipoMaquina } from '../../core/models/machines.model';
import { MaquinaService } from '../../core/services/machine.service';
import {  RouterModule } from '@angular/router';
import { catchError,  filter,  map, Observable, of} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { ToolService } from '../../core/services/tool.service';
import { Origen } from '../../core/models/tool.model';
@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit{
  maquinaForm: FormGroup;
  tiposMaquina: TipoMaquina[] = ['Extrusora', 'Termoformadora', 'Molino'];


  public extrusoras$: Observable<Extrusora[]>;
  public termoformadoras$: Observable<Termoformadora[]>;
  public molinos$: Observable<Molino[]>;
  public origenes$: Observable<Origen[]>;
  public errorMsg: string | null = null;


  public isModalOpen = false;
  public isEditMode = false;
  public selectedMaquina: Maquina | null = null;  

  constructor(
    private fb: FormBuilder,
    private maquinaService: MaquinaService,
    private confirmationService: ConfirmationService,
    private toolService: ToolService
  ) {
   
    this.maquinaForm = this.fb.group({
      tipo: [null, [Validators.required]],
      codigo: ['', [Validators.required]],
      nroSerie: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      activo: [true, [Validators.required]],
    });

   
    this.extrusoras$ = of([]);
    this.termoformadoras$ = of([]);
    this.molinos$ = of([]);
    this.origenes$ = of([]);
  }

  ngOnInit(): void {
    
    this.loadMaquinas();
    this.loadOrigenes();
   
    this.maquinaForm.get('tipo')?.valueChanges.subscribe((tipo: TipoMaquina) => {
      this.actualizarControlesDinamicos(tipo);
    });

    
  }

  loadOrigenes(): void {
    // Llama a tu ToolService genérico con el tipo 'Origen'
    this.origenes$ = this.toolService.getAll('Origen').pipe(
      catchError(err => {
        this.errorMsg = 'Error al cargar lista de orígenes.';
        return of([]);
      })
    );
  }



  loadMaquinas(): void {
    this.errorMsg = null; 
    const allMaquinas$ = this.maquinaService.getMaquinas().pipe(
      catchError(err => {
        this.errorMsg = 'Error al cargar las máquinas: ' + (err.error?.message || err.message);
        return of([]);
      })
    );

    this.extrusoras$ = allMaquinas$.pipe(
      map(maquinas => maquinas.filter(m => m.tipo === 'Extrusora') as Extrusora[])
    );
    this.termoformadoras$ = allMaquinas$.pipe(
      map(maquinas => maquinas.filter(m => m.tipo === 'Termoformadora') as Termoformadora[])
    );
    this.molinos$ = allMaquinas$.pipe(
      map(maquinas => maquinas.filter(m => m.tipo === 'Molino') as Molino[])
    );
  }

 deleteMaquina(maquina: Maquina): void { 
 
    this.confirmationService.confirm({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar la máquina "${maquina.codigo} - ${maquina.marca}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).pipe(
      
      filter(confirmed => confirmed === true)
    ).subscribe({
      next: () => {
        
        this.maquinaService.deleteMaquina(maquina.id).subscribe({
          next: () => this.loadMaquinas(), 
          error: (err) => this.errorMsg = 'Error al eliminar: ' + (err.message || err.error?.message)
        });
      }
    });
  }

  

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedMaquina = null;
    this.errorMsg = null; 
    this.maquinaForm.reset({ tipo: null, activo: true }); 
    this.maquinaForm.get('tipo')?.enable(); 
    this.isModalOpen = true;
  }

  openEditModal(maquina: Maquina): void {
    this.isEditMode = true;
    this.selectedMaquina = maquina;
    this.errorMsg = null;

    // 1. Crear controles (se inicializa en vacío [])
    this.actualizarControlesDinamicos(maquina.tipo);

    // 2. Llenar datos básicos
    this.maquinaForm.patchValue(maquina, { emitEvent: false });

    if (maquina.tipo === 'Molino') {
      const origenes = (maquina as Molino).origenes || [];
      const origenIds = origenes.map(o => o.id);
      
      console.log('Intentando marcar IDs:', origenIds);

     setTimeout(() => {
        const control = this.maquinaForm.get('origenIds');
        if (control) {
            control.setValue(origenIds);
            control.updateValueAndValidity(); // Fuerza a Angular a revisar este campo
            console.log('Valor establecido en el control:', control.value);
        }
      }, 50); // 50ms es imperceptible para el humano pero una eternidad para la máquina
    }

    this.maquinaForm.get('tipo')?.disable();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onOrigenChange(event: Event, origenId: number): void {

  const isChecked = (event.target as HTMLInputElement).checked;
  
 
  const currentIds = [...this.maquinaForm.get('origenIds')?.value || []];

  if (isChecked) {
  
    if (!currentIds.includes(origenId)) {
      currentIds.push(origenId);
    }
  } else {
    
    const index = currentIds.indexOf(origenId);
    if (index > -1) {
      currentIds.splice(index, 1);
    }
  }


  this.maquinaForm.get('origenIds')?.setValue(currentIds);
 
  this.maquinaForm.get('origenIds')?.markAsTouched();
}

isOrigenChecked(origenId: number): boolean {
  const currentIds = this.maquinaForm.get('origenIds')?.value || [];
  
   return currentIds.some((id: any) => id == origenId);
}

 

  actualizarControlesDinamicos(tipo: TipoMaquina): void {
   
    this.maquinaForm.removeControl('rendimiento');
    this.maquinaForm.removeControl('areaDeFormado');
    this.maquinaForm.removeControl('origenIds');

    switch (tipo) {
      case 'Extrusora':
        this.maquinaForm.addControl('rendimiento', this.fb.control(null, [Validators.required, Validators.min(0)]));
        break;
      case 'Termoformadora':
        this.maquinaForm.addControl('areaDeFormado', this.fb.control('', [Validators.required]));
        break;
      case 'Molino':
        this.maquinaForm.addControl('origenIds', this.fb.control([], [Validators.required, Validators.minLength(1)]));
        break;
    }
  }

  onSubmit(): void {
    if (this.maquinaForm.invalid) {
      this.maquinaForm.markAllAsTouched();
      return;
    }

  
    const formData = this.maquinaForm.getRawValue();
    this.errorMsg = null; 
    let save$: Observable<Maquina>; 

    if (this.isEditMode && this.selectedMaquina) {
      const id = this.selectedMaquina.id;
      switch (formData.tipo) {
        case 'Extrusora':
          save$ = this.maquinaService.updateExtrusora(id, formData); 
          break;
        case 'Termoformadora':
          save$ = this.maquinaService.updateTermoformadora(id, formData); 
          break;
        case 'Molino':
          save$ = this.maquinaService.updateMolino(id, formData); 
          break;
        default:
          save$ = of();
      }
    } else {
      switch (formData.tipo) {
        case 'Extrusora':
          save$ = this.maquinaService.createExtrusora(formData);
          break;
        case 'Termoformadora':
          save$ = this.maquinaService.createTermoformadora(formData);
          break;
        case 'Molino':
          save$ = this.maquinaService.createMolino(formData);
          break;
        default:
          save$ = of();
      }
    }
   
    save$.pipe(
      catchError(err => {
        this.errorMsg = 'Error al guardar: ' + (err.error?.message || err.message);
        return of(null);
      })
    ).subscribe((result) => {
      if (result) { 
        this.onSaveSuccess();
      }
    });
  }

  onSaveSuccess(): void {
    console.log('¡Guardado con éxito!');
    this.closeModal();   
    this.loadMaquinas(); 
  }


  cancelar(): void {
    this.closeModal();
  }
}
