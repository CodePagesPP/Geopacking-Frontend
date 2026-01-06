import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrdenTrabajoTF } from '../../core/models/plan-prod-tf';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orden-prod-tf',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './orden-prod-tf.component.html',
  styleUrl: './orden-prod-tf.component.css'
})
export class OrdenProdTfComponent implements OnInit{

  listaOTs: OrdenTrabajoTF[] = [];
  otSeleccionada: OrdenTrabajoTF | null = null;

  registroActual = {
    codigoBobina: '',
    loteBobina: '',
    nombreBobina: '',
    velocidad: 0,
    horaInicio: '',
    horaFin: '',
    cajas: 0,
    rechazoKg: 0
  };

  listaDetalles: any[] = [];
  observacionesGenerales: string = '';

  constructor(private otService: PlanProdTfService) { }

  ngOnInit(): void {
    this.cargarOrdenesPendientes();
  }

  cargarOrdenesPendientes() {

    this.otService.listarot().subscribe({
      next: (data) => {
        this.listaOTs = data; 
        console.log('OTs TF Pendientes:', data);
      },
      error: (err) => console.error(err)
    });
  }

  onDrop(event: CdkDragDrop<OrdenTrabajoTF[]>) {
    moveItemInArray(this.listaOTs, event.previousIndex, event.currentIndex);
    this.guardarPrioridad();
  }

  guardarPrioridad() {
    this.otService.actualizarOrden(this.listaOTs).subscribe();
  }

  esIniciable(index: number): boolean {
    return index < 3;
  }

  seleccionarOT(ot: OrdenTrabajoTF) {
    this.otSeleccionada = ot;
    this.listaDetalles = []; 
    this.limpiarFormulario();
  }

  buscarBobina() {
    if (!this.registroActual.codigoBobina) return;
    console.log("Buscando bobina:", this.registroActual.codigoBobina);
    
    this.registroActual.loteBobina = 'LOTE-SIM-' + Math.floor(Math.random() * 1000);
    this.registroActual.nombreBobina = 'Bobina PET Transparente (Simulada)';
    

    const now = new Date();
    this.registroActual.horaInicio = now.toTimeString().substring(0, 5); 
  }

  agregarRegistro() {
    if (!this.registroActual.codigoBobina) return;
    this.listaDetalles.push({ ...this.registroActual });
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.registroActual = {
      codigoBobina: '',
      loteBobina: '',
      nombreBobina: '',
      velocidad: 0,
      horaInicio: '',
      horaFin: '',
      cajas: 0,
      rechazoKg: 0
    };
  }

  guardarAvance() {
    console.log('Guardando avance de OT:', this.otSeleccionada?.codigo);
    console.log('Detalles:', this.listaDetalles);
    console.log('Obs:', this.observacionesGenerales);
  }
}
