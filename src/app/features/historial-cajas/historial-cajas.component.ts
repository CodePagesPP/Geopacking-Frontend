import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial-cajas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-cajas.component.html',
  styleUrl: './historial-cajas.component.css'
})
export class HistorialCajasComponent implements OnInit {

  listaCajas: any[] = [];
  cargando: boolean = false;

  fechaDesde: string = '';
  fechaHasta: string = '';

  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.otService.listarHistorial().subscribe({
      next: (data) => {
        this.listaCajas = data;
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }

  filtrar() {
    if (this.fechaDesde && this.fechaHasta) {
      this.cargando = true;
      this.otService.listarHistorial(this.fechaDesde, this.fechaHasta).subscribe({
        next: (data) => {
          this.listaCajas = data;
          this.cargando = false;
        },
        error: (e) => {
          Swal.fire('Error', 'No se pudo filtrar el historial', 'error');
          this.cargando = false;
        }
      });
    } else {
      this.cargarDatos();
    }
  }

  limpiar() {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.cargarDatos();
  }

  reimprimirEtiqueta(item: any) {
    Swal.fire({ title: 'Generando PDF...', didOpen: () => Swal.showLoading() });

    this.otService.descargarEtiquetas(item.id, 1).subscribe({
      next: (blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Etiqueta_Reprint_${item.otCodigo}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.close();
        Swal.fire('Error', 'No se pudo regenerar la etiqueta.', 'error');
      }
    });
  }
}
