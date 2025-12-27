import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanProdExService } from '../../core/services/plan-prod-ex.service';
import { BobinaTransito } from '../../core/models/plan-prod-ex';

@Component({
  selector: 'app-prods-tran-ex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prods-tran-ex.component.html',
  styleUrl: './prods-tran-ex.component.css'
})
export class ProdsTranExComponent implements OnInit{

  private planProdService = inject(PlanProdExService);

  bobinas: BobinaTransito[] = [];
  bobinasFiltradas: BobinaTransito[] = [];

  stockTotalAlmacen: number = 0;

  totalBobinas: number = 0;
  totalKilosFiltrados: number = 0;

  filtros = {
    fechaInicio: '',
    fechaFin: '',
    busqueda: ''
  }

  isLoading = false;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;

    this.planProdService.obtenerStockTotal().subscribe({
      next: (total) => this.stockTotalAlmacen = total,
      error: () => this.stockTotalAlmacen = 0
    });

    this.planProdService.getBobinasTransito().subscribe({
      next: (data) => {
        this.bobinas = data;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando bobinas', err);
        this.isLoading = false;
      }
    });
  }
  
  aplicarFiltros() {
    let temp = [...this.bobinas];

    if (this.filtros.fechaInicio) {
      temp = temp.filter(b => b.fecha >= this.filtros.fechaInicio);
    }
    if (this.filtros.fechaFin) {
      temp = temp.filter(b => b.fecha.substring(0, 10) <= this.filtros.fechaFin);
    }

    if (this.filtros.busqueda) {
      const term = this.filtros.busqueda.toLowerCase();
      temp = temp.filter(b => 
        b.codigoBobina.toLowerCase().includes(term) ||
        b.nombreProducto.toLowerCase().includes(term) ||
        b.codigoOT.toLowerCase().includes(term)
      );
    }

    this.bobinasFiltradas = temp;
    
    this.totalBobinas = this.bobinasFiltradas.length;
    this.totalKilosFiltrados = this.bobinasFiltradas.reduce((acc, item) => acc + item.pesoNeto, 0);
  }

  limpiarFiltros() {
    this.filtros = { fechaInicio: '', fechaFin: '', busqueda: '' };
    this.aplicarFiltros();
  }
}
