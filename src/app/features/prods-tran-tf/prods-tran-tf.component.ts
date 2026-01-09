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

  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    
    this.otService.listarInventarioTF().subscribe({
      next: (data) => {
        this.inventarioOriginal = data;
        console.log('Inventario cargado:', this.inventarioOriginal);
        this.filtrar();
      },
      error: (err) => console.error('Error cargando inventario', err)
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
