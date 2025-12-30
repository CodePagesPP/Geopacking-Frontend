import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import { ToolService } from '../../core/services/tool.service';
import { OrdenTrabajoTF } from '../../core/models/plan-prod-tf';
import Swal from 'sweetalert2';
import { MaquinaService } from '../../core/services/machine.service';
import { ProductsService } from '../../core/services/products.service';
import { Maquina } from '../../core/models/machines.model';
import { ProductoTF } from '../../core/models/products.model';

@Component({
  selector: 'app-plan-prod-tf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-prod-tf.component.html',
  styleUrl: './plan-prod-tf.component.css',
})
export class PlanProdTfComponent implements OnInit {
  mostrarModal: boolean = false;
  listaOrdenes: OrdenTrabajoTF[] = [];

  listaOrdenesFiltrada: OrdenTrabajoTF[] = [];
  filtroMaquina: string = '';
  filtroProducto: string = '';
  filtroEstado: string = '';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';

  listaMaquinasTermoformadoras: Maquina[] = [];
  listaProductosTF: ProductoTF[] = [];

  usuarioId: number = 1;
  usuarioname: string = 'Cargando...';

  nuevaOrden: OrdenTrabajoTF = {
    maquinaId: 0,
    productoId: 0,
    requerimientoKg: 0,
    creadaPorId: 1,
    creadaPorUsername: 'Cargando...',
  };

  productoBaseVisual: string = '';

  constructor(
    private otService: PlanProdTfService,
    private maquinaService: MaquinaService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioDelToken();
    this.cargarDatosIniciales();
  }

  obtenerUsuarioDelToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          this.usuarioId = payload.id;
          this.usuarioname = payload.name;
        } else if (payload.userId) {
          this.usuarioId = payload.userId;
        }
      } catch (e) {
        console.error('Error token', e);
      }
    }
    this.nuevaOrden.creadaPorId = this.usuarioId;
    this.nuevaOrden.creadaPorUsername = this.usuarioname;
  }

  cargarDatosIniciales() {
      this.otService.listar().subscribe((data) => {
        this.listaOrdenes = data;
        this.listaOrdenes.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.listaOrdenesFiltrada = [...this.listaOrdenes];
      });

      this.maquinaService.getMaquinasActivas().subscribe((maquinas) => {
        this.listaMaquinasTermoformadoras = maquinas.filter((m) => m.tipo === 'Termoformadora');
      });

      this.productsService.getAll('TF').subscribe((productos) => {
        this.listaProductosTF = productos;
      });
    }

  aplicarFiltros() {
    this.listaOrdenesFiltrada = this.listaOrdenes.filter((ot) => {
      const coincideMaquina = this.filtroMaquina
        ? ot.maquinaId == Number(this.filtroMaquina)
        : true;

      const coincideProducto = this.filtroProducto
        ? ot.productoId == Number(this.filtroProducto)
        : true;

      const coincideEstado = this.filtroEstado
        ? ot.estado === this.filtroEstado
        : true;

      let coincideFecha = true;
      if (this.filtroFechaDesde && this.filtroFechaHasta) {
        if (ot.fechaCreacion) {
          const fechaOT = new Date(ot.fechaCreacion);
          const desde = new Date(this.filtroFechaDesde);
          const hasta = new Date(this.filtroFechaHasta);

          desde.setHours(0, 0, 0, 0);
          hasta.setHours(23, 59, 59, 999);

          coincideFecha = fechaOT >= desde && fechaOT <= hasta;
        }
      }

      return (
        coincideMaquina && coincideProducto && coincideEstado && coincideFecha
      );
    });
  }

  limpiarFiltros() {
    this.filtroMaquina = '';
    this.filtroProducto = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.listaOrdenesFiltrada = [...this.listaOrdenes];
  }

  abrirModal() {
    this.mostrarModal = true;
    this.productoBaseVisual = '';
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  onProductoChange() {
    const prod = this.listaProductosTF.find(
      (p) => p.id == this.nuevaOrden.productoId
    );

    if (prod && prod.productoBase) {
      this.productoBaseVisual = prod.productoBase.name;
    } else {
      this.productoBaseVisual = 'N/A';
    }
  }

  guardarOrden() {
    if (this.nuevaOrden.maquinaId === 0 || this.nuevaOrden.productoId === 0) {
      Swal.fire('Atención', 'Seleccione máquina y producto.', 'warning');
      return;
    }
    if (this.nuevaOrden.requerimientoKg <= 0) {
      Swal.fire(
        'Atención',
        'El requerimiento debe ser mayor a 0 Kg.',
        'warning'
      );
      return;
    }

    Swal.fire({ title: 'Generando...', didOpen: () => Swal.showLoading() });

    this.otService.crear(this.nuevaOrden).subscribe({
      next: (res) => {
        Swal.fire('¡Generada!', `OT ${res.codigo} creada.`, 'success');
        this.cargarDatosIniciales();
        this.cerrarModal();
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'No se pudo generar la orden.', 'error');
      },
    });
  }

  limpiarFormulario() {
    this.nuevaOrden = {
      maquinaId: 0,
      productoId: 0,
      requerimientoKg: 0,
      creadaPorId: this.usuarioId,
      creadaPorUsername: this.usuarioname,
    };
    this.productoBaseVisual = '';
  }
}
