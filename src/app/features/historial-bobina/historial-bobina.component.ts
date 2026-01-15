import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanProdExService } from '../../core/services/plan-prod-ex.service';
import { BobinaHistorialDTO } from '../../core/models/plan-prod-ex';

@Component({
  selector: 'app-historial-bobina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-bobina.component.html',
  styleUrl: './historial-bobina.component.css'
})
export class HistorialBobinaComponent {
  listaBobinas: BobinaHistorialDTO[] = [];
  fechaDesde: string = '';
  fechaHasta: string = '';

  
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(private bobinaService: PlanProdExService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.bobinaService.obtenerHistorialBobinas(
      this.currentPage, 
      this.pageSize, 
      this.fechaDesde, 
      this.fechaHasta
    ).subscribe({
      next: (data) => {
        // En Spring Boot 'Page', la lista está en 'content'
        this.listaBobinas = data.content; 
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      error: (e) => console.error(e)
    });
  }

  filtrar() {
    this.currentPage = 0; // Al filtrar, volvemos a la página 1
    this.cargarDatos();
  }

  limpiar() {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.filtrar(); // Reutilizamos filtrar para resetear y cargar
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.currentPage + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarDatos();
    }
  }

imprimirIndividual(id: number) {
  this.bobinaService.descargarReporteIndividual(id).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Bobina_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => alert('Error al descargar')
  });
}
}
