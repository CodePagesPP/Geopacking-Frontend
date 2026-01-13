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
  mostrarModalSalida = false;
  codigoBusqueda: string = '';
  lotesEncontrados: any[] = [];
  loteSeleccionado: any = null;
  cantidadRetirar: number | null = null;
  listaSalida: any[] = [];
  motivoSalida: string = '';
comentariosSalida: string = '';
currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarInventarioPT();
  }

  cargarInventarioPT() {
    this.otService.listarInventarioPT(
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
      error: (err) => console.error(err)
    });

    this.otService.obtenerStockTotal(
        "EN_PT",
        this.fechaInicio,
        this.fechaFin,
        this.busqueda
    ).subscribe({
        next: (total) => {
            this.stockTotal = total || 0;
        },
        error: (err) => console.error(err)
    });
  }

  filtrar() {
    this.currentPage = 0; // Resetear a pág 1 al filtrar
    this.cargarInventarioPT();
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
      this.cargarInventarioPT();
    }
  }

  abrirModalSalida() {
    this.mostrarModalSalida = true;
    this.limpiarFormulario();
    this.listaSalida = [];
  }

  cerrarModalSalida() {
    this.mostrarModalSalida = false;
  }

  limpiarFormulario() {
    this.codigoBusqueda = '';
    this.lotesEncontrados = [];
    this.loteSeleccionado = null;
    this.cantidadRetirar = null;
  }

  buscarProducto() {
    if (!this.codigoBusqueda) return;

    this.otService.buscarPorCodigo(this.codigoBusqueda).subscribe({
      next: (data) => {
        this.lotesEncontrados = data;
        if (data.length === 0) {
            Swal.fire('No encontrado', 'No hay stock con ese código', 'warning');
        } else if (data.length === 1) {
            this.loteSeleccionado = data[0]; 
        } else {
            this.loteSeleccionado = null; 
        }
        this.cantidadRetirar = null;
      },
      error: () => Swal.fire('Error', 'Error buscando producto', 'error')
    });
  }

  agregarALista() {
    if (!this.loteSeleccionado || !this.cantidadRetirar) return;

    if (this.cantidadRetirar > this.loteSeleccionado.cantidad) {
        Swal.fire('Error', 'Cantidad supera el stock disponible', 'error');
        return;
    }

    
    const yaExiste = this.listaSalida.find(x => x.id === this.loteSeleccionado.id);
    if (yaExiste) {
        Swal.fire('Atención', 'Este lote ya está en la lista', 'warning');
        return;
    }

    
    this.listaSalida.push({
        ...this.loteSeleccionado,
        cantidadRetirar: this.cantidadRetirar
    });

    
    this.loteSeleccionado = null;
    this.cantidadRetirar = null;
    this.lotesEncontrados = []; 
    this.codigoBusqueda = '';   
  }

  borrarDeLista(index: number) {
    this.listaSalida.splice(index, 1);
  }

  confirmarSalida() {
   
    if (this.listaSalida.length === 0) {
        Swal.fire('Lista vacía', 'Debe agregar al menos un producto.', 'warning');
        return;
    }
    if (!this.motivoSalida) {
        Swal.fire('Falta Motivo', 'Debe seleccionar un motivo de salida.', 'warning');
        return;
    }

   
    const request = {
        motivo: this.motivoSalida,        
        comentarios: this.comentariosSalida, 
        items: this.listaSalida.map(item => ({
            inventarioId: item.id,
            cantidadRetirar: item.cantidadRetirar
        }))
    };

    Swal.fire({ title: 'Procesando...', didOpen: () => Swal.showLoading() });

    
    this.otService.registrarSalida(request).subscribe({
        next: (blob) => {
            Swal.close();
            Swal.fire('Éxito', 'Salida registrada correctamente', 'success');

           
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Salida_${this.motivoSalida}_${new Date().getTime()}.pdf`;
            a.click();

            this.cerrarModalSalida();
            this.cargarInventarioPT();
        },
        error: (err) => {
            console.error(err);
            Swal.close();
            Swal.fire('Error', 'No se pudo registrar la salida', 'error');
        }
    });
  }
}
