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

    // Llama al endpoint de búsqueda por código
    this.otService.buscarPorCodigo(this.codigoBusqueda).subscribe({
      next: (data) => {
        this.lotesEncontrados = data;
        if (data.length === 0) {
            Swal.fire('No encontrado', 'No hay stock con ese código', 'warning');
        } else if (data.length === 1) {
            this.loteSeleccionado = data[0]; // Auto-seleccionar si es único
        } else {
            this.loteSeleccionado = null; // Si hay varios, que elija el usuario
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

    // Verificar duplicados en la lista temporal
    const yaExiste = this.listaSalida.find(x => x.id === this.loteSeleccionado.id);
    if (yaExiste) {
        Swal.fire('Atención', 'Este lote ya está en la lista', 'warning');
        return;
    }

    // Agregar a la "tablita"
    this.listaSalida.push({
        ...this.loteSeleccionado,
        cantidadRetirar: this.cantidadRetirar
    });

    // Limpiar inputs parciales para seguir agregando
    this.loteSeleccionado = null;
    this.cantidadRetirar = null;
    this.lotesEncontrados = []; // Opcional: limpiar búsqueda
    this.codigoBusqueda = '';   // Opcional: limpiar código
  }

  borrarDeLista(index: number) {
    this.listaSalida.splice(index, 1);
  }

  confirmarSalida() {
    if (this.listaSalida.length === 0) return;

    // Solo mandamos items, el backend pondrá "VENTA"
    const request = {
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

            // Descargar PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Salida_Venta_${new Date().getTime()}.pdf`;
            a.click();

            this.cerrarModalSalida();
            this.cargarInventarioPT(); // Refrescar tabla principal
        },
        error: (err) => {
            console.error(err);
            Swal.close();
            Swal.fire('Error', 'No se pudo registrar la salida', 'error');
        }
    });
  }
}
