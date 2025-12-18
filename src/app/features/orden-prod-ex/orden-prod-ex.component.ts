import { Component, OnInit } from '@angular/core';
import { Bobina, MaterialEX, OrdenTrabajoEX, TurnoHistorial } from '../../core/models/plan-prod-ex';
import { CommonModule } from '@angular/common';
import { PlanProdExService } from '../../core/services/plan-prod-ex.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-orden-prod-ex',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './orden-prod-ex.component.html',
  styleUrl: './orden-prod-ex.component.css'
})
export class OrdenProdEXComponent implements OnInit{
  listaOTs: OrdenTrabajoEX[] = [];
  otSeleccionada: OrdenTrabajoEX | null = null;
  bobinasTurno: Bobina[] = [];
  materialesTurno: MaterialEX[] = [];
  historialTurnos: TurnoHistorial[] = [];
  nuevaBobina: Bobina = { pesoBruto: 0, pesoNeto: 0 };
  nuevoMaterial: MaterialEX = { nombre: '', cantidadKg: 0 };
  constructor(private otService: PlanProdExService) { }

  ngOnInit(): void {
    this.cargarOrdenesReales();
  }

 
  cargarOrdenesReales() {
    this.otService.listar().subscribe({
      next: (data) => {
        
        this.listaOTs = data; 
        console.log('OTs cargadas:', data);
      },
      error: (err) => {
        console.error('Error al conectar con el backend:', err);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }


  onDrop(event: CdkDragDrop<OrdenTrabajoEX[]>) {
    moveItemInArray(this.listaOTs, event.previousIndex, event.currentIndex);
    this.guardarCambiosDePrioridad();
  }


  guardarCambiosDePrioridad() {
    this.otService.actualizarOrden(this.listaOTs).subscribe({
      next: () => console.log('Prioridad actualizada en BD'),
      error: (err) => {
        console.error('Error guardando prioridad', err);
        
        alert('Error al guardar el nuevo orden'); 
      }
    });
  }

  seleccionarOT(ot: OrdenTrabajoEX) {
    if (this.otSeleccionada && this.otSeleccionada.id !== ot.id) {
       const confirmar = confirm(`Ya tienes la OT ${this.otSeleccionada.codigo} en proceso. ¿Deseas cambiar?`);
       if (!confirmar) return;
    }
    this.otSeleccionada = ot;
    
    
    this.recuperarDatosLocales(ot.id!);
    
    this.cargarHistorial(ot.id!);
  }

  recuperarDatosLocales(otId: number) {
    const keyB = `temp_bobinas_${otId}`;
    const keyM = `temp_materiales_${otId}`;
    
    const b = localStorage.getItem(keyB);
    const m = localStorage.getItem(keyM);

    this.bobinasTurno = b ? JSON.parse(b) : [];
    this.materialesTurno = m ? JSON.parse(m) : [];
  }

  guardarEnLocal() {
    if (!this.otSeleccionada) return;
    const otId = this.otSeleccionada.id;
    localStorage.setItem(`temp_bobinas_${otId}`, JSON.stringify(this.bobinasTurno));
    localStorage.setItem(`temp_materiales_${otId}`, JSON.stringify(this.materialesTurno));
  }

  
  registrarBobina() {
    if (!this.otSeleccionada || this.nuevaBobina.pesoNeto <= 0) return;

    
    const correlativo = this.bobinasTurno.length + 1;
    const codigoGen = `${this.otSeleccionada.codigo}-B${correlativo}`;

    this.bobinasTurno.push({
      codigo: codigoGen,
      pesoBruto: this.nuevaBobina.pesoBruto,
      pesoNeto: this.nuevaBobina.pesoNeto
    });

    this.guardarEnLocal(); 
    this.nuevaBobina = { pesoBruto: 0, pesoNeto: 0 };
  }

  get totalKilosTurno(): number {
    return this.bobinasTurno.reduce((acc, b) => acc + b.pesoNeto, 0);
  }

  
  registrarMaterial() {
    if (this.nuevoMaterial.cantidadKg <= 0) return;
    
    this.materialesTurno.push({ ...this.nuevoMaterial });
    this.guardarEnLocal();
    this.nuevoMaterial = { nombre: '', cantidadKg: 0 };
  }

  
  cargarHistorial(otId: number) {
    this.otService.obtenerHistorial(otId).subscribe(data => this.historialTurnos = data);
  }

  
  finTurno() {
    if (!this.otSeleccionada) return;
    if (this.bobinasTurno.length === 0) {
      alert("No hay bobinas registradas.");
      return;
    }

    const payload = {
      otId: this.otSeleccionada.id,
      bobinas: this.bobinasTurno,
      materiales: this.materialesTurno
    };

    this.otService.finalizarTurno(payload).subscribe({
    next: (blob: Blob) => {
      alert('Turno finalizado. Descargando reporte...');
      
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Final_${this.otSeleccionada!.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
     
      const otId = this.otSeleccionada!.id;
      localStorage.removeItem(`temp_bobinas_${otId}`);
      localStorage.removeItem(`temp_materiales_${otId}`);
      this.bobinasTurno = [];
      this.materialesTurno = [];
      this.cargarHistorial(otId!);
    },
    error: (e) => alert('Error al finalizar turno.')
  });
  }
}
