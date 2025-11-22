import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { Operador, Reporte, UserRequest, UserResponse } from '../../core/models/worker.model';
import { WorkersService } from '../../core/services/workers.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
type WorkerType = 'OPERADOR' | 'AYUDANTE';
@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.css'
})
export class WorkersComponent {
 
  private workersService = inject(WorkersService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

 
  public operadores$ = new BehaviorSubject<UserResponse[]>([]);
  public ayudantes$ = new BehaviorSubject<UserResponse[]>([]);

 
  public showForm = false;
  public isEditing = false;
  public workerForm!: FormGroup;
  private currentWorkerId: number | null = null;
  public currentWorkerType: WorkerType | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadOperadores();
    this.loadAyudantes();
    
  }

  initForm(): void {
   
    this.workerForm = this.fb.group({
      dni: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      role: ['', Validators.required],
      password: ['']
    });
  }

  loadOperadores(): void {
    this.workersService.getAll('OPERATOR').subscribe(data => this.operadores$.next(data));
    
  }

  loadAyudantes(): void {
    // Asumiendo que en tu BD el rol se llama 'AYUDANTE'
    this.workersService.getAll('AYUDANTE').subscribe(data => this.ayudantes$.next(data));
  }

 

  openNewForm(): void {
    this.isEditing = false;
    this.showForm = true;
    this.currentWorkerId = null;
    this.workerForm.reset({ sex: '', role: '' });
    this.workerForm.get('role')?.enable();
  
    this.workerForm.get('password')?.setValidators([Validators.required]);
    this.workerForm.get('password')?.updateValueAndValidity();
  }

  openEditForm(worker: UserResponse): void {
    this.isEditing = true;
    this.showForm = true;
    this.currentWorkerId = worker.id;
    
    // Password opcional
    this.workerForm.get('password')?.clearValidators();
    this.workerForm.get('password')?.updateValueAndValidity();
  
    // Llenamos el formulario
    this.workerForm.patchValue({
      dni: worker.dni,
      name: worker.name,
      lastName: worker.lastName,
      sex: worker.sex,
      role: worker.role // El backend debe devolver el string correcto
    });

    // Generalmente bloqueamos el cambio de rol al editar para evitar conflictos
    this.workerForm.get('role')?.disable();
  }

  closeForm(): void {
    this.showForm = false;
    this.currentWorkerId = null;
  }

  saveWorker(): void {
    if (this.workerForm.invalid) return;

    // Usamos getRawValue() para obtener el campo 'role' aunque esté disabled (en edición)
    const formValues = this.workerForm.getRawValue();
    
    const payload: UserRequest = {
      dni: formValues.dni,
      name: formValues.name,
      lastName: formValues.lastName,
      sex: formValues.sex,
      password: formValues.password,
      role: formValues.role // El rol viene del select
    };

    if (!payload.password) delete payload.password;

    const operation = (this.isEditing && this.currentWorkerId)
      ? this.workersService.update(this.currentWorkerId, payload)
      : this.workersService.create(payload);

    operation.subscribe({
      next: () => {
        // Éxito: Refrescamos las listas
        // Puedes refrescar ambas para asegurarte, o solo la del rol tocado
        this.loadOperadores();
        this.loadAyudantes();
        
        this.closeForm();
        Swal.fire('Éxito', 'Usuario guardado correctamente', 'success');
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar. Verifique DNI.', 'error');
      }
    });
  }

  // --- Manejo de Eliminación ---

  onDelete(worker: UserResponse): void {
    this.confirmationService.confirm({
      title: 'Eliminar Usuario',
      message: `¿Eliminar a ${worker.name} (${worker.role})?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar'
    })
    .pipe(
      filter(ok => ok === true),
      switchMap(() => this.workersService.delete(worker.id))
    )
    .subscribe({
      next: () => {
        // Refrescar todo
        this.loadOperadores();
        this.loadAyudantes();
        Swal.fire('Eliminado', 'Usuario eliminado.', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
    });
  }
}
