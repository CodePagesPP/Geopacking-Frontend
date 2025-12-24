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
  listaFiltrada: BobinaHistorialDTO[] = [];
  fechaDesde: string = '';
  fechaHasta: string = '';

  constructor(private bobinaService: PlanProdExService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    
    this.bobinaService.obtenerHistorialBobinas(this.fechaDesde, this.fechaHasta).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        
        this.listaBobinas = data;     
        this.listaFiltrada = data;    
        
        
      },
      error: (e) => console.error(e)
    });
  }

  filtrar() {
  if (this.fechaDesde && this.fechaHasta) {
    
    this.bobinaService.obtenerHistorialBobinas(this.fechaDesde, this.fechaHasta).subscribe({
      next: (data) => {
         
         this.listaFiltrada = data; 
         
         
         this.listaBobinas = data;
      },
      error: (e) => alert('Error al filtrar')
    });
  } else {
    // Si no hay fechas, recargamos todo
    this.cargarDatos();
  }
}

limpiar() {
  this.fechaDesde = '';
  this.fechaHasta = '';
  this.cargarDatos(); 
}

imprimirReporte() {
  
  this.bobinaService.descargarReporteStock(this.fechaDesde, this.fechaHasta).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Bobinas_${this.fechaDesde || 'General'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (e) => alert('Error al descargar reporte')
  });
}
}
