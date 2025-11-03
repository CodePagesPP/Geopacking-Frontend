import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { Operador, Reporte, UserResponse } from '../../core/models/worker.model';
import { WorkersService } from '../../core/services/workers.service';
import { CommonModule } from '@angular/common';
type WorkerType = 'OPERADOR' | 'REPORTE';
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
  public reportes$ = new BehaviorSubject<UserResponse[]>([]);

 
  public showForm = false;
  public isEditing = false;
  public workerForm!: FormGroup;
  private currentWorkerId: number | null = null;
  public currentWorkerType: WorkerType | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadOperadores();
    this.loadReportes();
  }

  initForm(): void {
   
    this.workerForm = this.fb.group({
      dni: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      password: ['']
    });
  }

  loadOperadores(): void {
    this.workersService.getAllOperators().subscribe(data => this.operadores$.next(data));
  }

  loadReportes(): void {
    this.workersService.getAllReport().subscribe(data => this.reportes$.next(data));
  }

 

  openNewForm(type: WorkerType): void {
    this.isEditing = false;
    this.showForm = true;
    this.currentWorkerType = type;
    this.workerForm.reset({ sex: '' });
    
  
    this.workerForm.get('password')?.setValidators([Validators.required]);
    this.workerForm.get('password')?.updateValueAndValidity();
  }

  openEditForm(worker: UserResponse, type: WorkerType): void {
    this.isEditing = true;
    this.showForm = true;
    this.currentWorkerType = type;
    this.currentWorkerId = worker.id;
    
   
    this.workerForm.get('password')?.clearValidators();
    this.workerForm.get('password')?.updateValueAndValidity();

  
    this.workerForm.patchValue({
      dni: worker.dni,
      name: worker.name,
      lastName: worker.lastName,
      sex: (worker as any).sex || '' 
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.currentWorkerId = null;
    this.currentWorkerType = null;
  }

  saveWorker(): void {
    if (this.workerForm.invalid) return;

    const payload: Operador | Reporte = { ...this.workerForm.value };
    if (!payload.password) {
      delete payload.password;
    }

    let obs: Observable<UserResponse>;

    // Lógica para decidir qué servicio llamar
    if (this.isEditing && this.currentWorkerId) {
      obs = this.currentWorkerType === 'OPERADOR'
        ? this.workersService.updateOperator(this.currentWorkerId, payload)
        : this.workersService.updateReport(this.currentWorkerId, payload as Reporte);
    } else {
      obs = this.currentWorkerType === 'OPERADOR'
        ? this.workersService.createOperator(payload)
        : this.workersService.createReport(payload as Reporte);
    }

    obs.subscribe(() => {
      // Recargamos solo la lista que modificamos
      if (this.currentWorkerType === 'OPERADOR') {
        this.loadOperadores();
      } else {
        this.loadReportes();
      }
      this.closeForm();
    });
  }

  // --- Manejo de Eliminación ---

  onDelete(worker: UserResponse, type: WorkerType): void {
    this.confirmationService.confirm({
      title: `Eliminar ${type === 'OPERADOR' ? 'Operador' : 'Reporte'}`,
      message: `¿Estás seguro de que deseas eliminar a ${worker.name} ${worker.lastName}?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'No, cancelar'
    })
    .pipe(
      filter(confirmed => confirmed === true),
      switchMap(() => {
        // Decidimos qué servicio de eliminación llamar
        return type === 'OPERADOR'
          ? this.workersService.deleteOperator(worker.id)
          : this.workersService.deleteReport(worker.id);
      })
    )
    .subscribe(() => {
      // Recargamos la lista correspondiente
      if (type === 'OPERADOR') {
        this.loadOperadores();
      } else {
        this.loadReportes();
      }
    });
  }
}
