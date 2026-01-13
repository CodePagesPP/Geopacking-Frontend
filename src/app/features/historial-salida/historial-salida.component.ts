import { Component } from '@angular/core';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial-salida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-salida.component.html',
  styleUrl: './historial-salida.component.css'
})
export class HistorialSalidaComponent {
historial: any[] = [];
  cargando: boolean = false;
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

 
  fechaInicio: string = '';
  fechaFin: string = '';
  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.cargando = true;
    
    this.otService.listarHistorialSalidas(this.currentPage, this.pageSize, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          
          this.historial = data.content; 
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
        }
      });
  }

  filtrar() {
    this.currentPage = 0; 
    this.cargarHistorial();
  }

 
  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtrar();
  }

  
  cambiarPagina(delta: number) {
    const nuevaPagina = this.currentPage + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarHistorial();
    }
  }

  imprimirReporte(movimiento: any) {
    Swal.fire({ title: 'Generando PDF...', didOpen: () => Swal.showLoading() });
    
    this.otService.reimprimirSalida(movimiento.id).subscribe({
      next: (blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
       
        a.download = `Reporte_Historial_${movimiento.id}_${movimiento.motivo}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.close();
        Swal.fire('Error', 'No se pudo generar el reporte', 'error');
      }
    });
  }
}
