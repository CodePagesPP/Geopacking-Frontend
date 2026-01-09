import { Component } from '@angular/core';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prods-terminados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prods-terminados.component.html',
  styleUrl: './prods-terminados.component.css'
})
export class ProdsTerminadosComponent {
inventarioOriginal: any[] = [];
  inventarioFiltrado: any[] = [];
  
  stockTotal: number = 0;
  busqueda: string = '';

  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarInventarioPT();
  }

  cargarInventarioPT() {
    
    this.otService.listarInventarioPT().subscribe({
      next: (data) => {
        this.inventarioOriginal = data;
        this.filtrar();
      },
      error: (err) => console.error('Error cargando inventario PT', err)
    });
  }

  filtrar() {
    const term = this.busqueda.toLowerCase().trim();
    
    this.inventarioFiltrado = this.inventarioOriginal.filter(item => 
      item.loteProduccion.toLowerCase().includes(term) ||
      item.nombreProducto.toLowerCase().includes(term)
    );

    this.stockTotal = this.inventarioFiltrado.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  }


}
