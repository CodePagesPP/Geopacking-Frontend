import { Component } from '@angular/core';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prods-tran-tf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prods-tran-tf.component.html',
  styleUrl: './prods-tran-tf.component.css'
})
export class ProdsTranTfComponent {
  inventarioOriginal: any[] = [];
  inventarioFiltrado: any[] = [];
  
  stockTotal: number = 0;
  busqueda: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    this.otService.listarInventarioTF(
        this.currentPage,
        this.pageSize,
        this.fechaInicio,
        this.fechaFin,
        this.busqueda
    ).subscribe({
      next: (data) => {
        
        this.inventarioFiltrado = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      error: (err) => console.error('Error cargando inventario', err)
    });

    this.otService.obtenerStockTotal(
        "EN_TF",
        this.fechaInicio,
        this.fechaFin,
        this.busqueda
    ).subscribe({
        next: (total) => {
            this.stockTotal = total || 0; // Actualizamos la tarjeta
        },
        error: (err) => console.error(err)
    });
  }

  filtrar() {
    this.currentPage = 0; 
    this.cargarInventario();
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtrar();
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.currentPage + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.currentPage = nuevaPagina;
      this.cargarInventario();
    }
  }

  enviarAPt(item: any) {
    Swal.fire({
      title: '¿Enviar a Productos Terminados?',
      html: `
        Vas a mover <b>${item.cantidad} cajas</b> <br>
        del producto: <b>${item.nombreProducto}</b> <br>
        Lote: <b>${item.loteProduccion}</b>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, transferir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
       
        this.otService.enviarATerminados(item.id).subscribe({
          next: () => {
            Swal.fire(
              '¡Transferido!',
              'El lote ha sido enviado a Productos Terminados correctamente.',
              'success'
            );
            this.cargarInventario(); 
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo realizar la transferencia.', 'error');
          }
        });

      }
    });
  }


}
