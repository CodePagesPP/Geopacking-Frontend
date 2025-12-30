import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrdenTrabajoTF } from '../../core/models/plan-prod-tf';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';

@Component({
  selector: 'app-orden-prod-tf',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './orden-prod-tf.component.html',
  styleUrl: './orden-prod-tf.component.css'
})
export class OrdenProdTfComponent implements OnInit{

  listaOTs: OrdenTrabajoTF[] = [];
  otSeleccionada: OrdenTrabajoTF | null = null;

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
  }
}
