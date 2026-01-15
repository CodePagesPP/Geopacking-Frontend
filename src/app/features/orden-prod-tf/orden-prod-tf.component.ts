import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrdenTrabajoTF } from '../../core/models/plan-prod-tf';
import { PlanProdTfService } from '../../core/services/plan-prod-tf.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductoTF } from '../../core/models/products.model';

@Component({
  selector: 'app-orden-prod-tf',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './orden-prod-tf.component.html',
  styleUrl: './orden-prod-tf.component.css',
})
export class OrdenProdTfComponent implements OnInit {
  listaOTs: OrdenTrabajoTF[] = [];
  otSeleccionada: OrdenTrabajoTF | null = null;

  registroActual = {
    codigoBobina: '',
    loteBobina: '',
    nombreBobina: '',
    velocidad: 0,
    horaInicio: '',
    horaFin: '',
    cajas: 0,
    rechazoKg: 0,
    pesoPromedio: 0,
    bobinaFin: false
  };

  listaDetalles: any[] = [];
  observacionesGenerales: string = '';

  contadorCajasAcumulado: number = 0;

  constructor(private otService: PlanProdTfService) {}

  ngOnInit(): void {
    this.cargarOrdenesPendientes();
  }

  cargarOrdenesPendientes() {
    this.otService.listarot().subscribe({
      next: (data) => {
        this.listaOTs = data;
      },
      error: (err) => console.error(err),
    });
  }

  onDrop(event: CdkDragDrop<OrdenTrabajoTF[]>) {
    moveItemInArray(this.listaOTs, event.previousIndex, event.currentIndex);
    this.guardarPrioridad();
  }

  guardarPrioridad() {
    this.otService.actualizarOrden(this.listaOTs).subscribe();
  }

  esIniciable(index: number): boolean {
    return index < 3;
  }

  seleccionarOT(ot: OrdenTrabajoTF) {
    this.otSeleccionada = ot;
    this.listaDetalles = [];
    this.limpiarFormulario();
    this.contadorCajasAcumulado = ot.producidoKg || 0;
  }

  buscarBobina() {
    const codigo = this.registroActual.codigoBobina
      ? this.registroActual.codigoBobina.trim()
      : '';
    if (!codigo) return;


    this.otService.obtenerInfoBobina(codigo).subscribe({
      next: (data) => {
        this.registroActual.loteBobina = data.lote;
        this.registroActual.nombreBobina = data.nombreProducto;

        const now = new Date();
        this.registroActual.horaInicio = now.toTimeString().substring(0, 5);
      },
      error: (err) => {
        console.error(err);
        this.registroActual.loteBobina = '';
        this.registroActual.nombreBobina = '';
        Swal.fire({
          icon: 'error',
          title: 'Bobina no encontrada',
          text: `El código ${codigo} no existe en el inventario.`,
          timer: 2000,
        });
      },
    });
  }

agregarRegistro() {
    if (!this.registroActual.codigoBobina) {
        Swal.fire('Falta Bobina', 'Debe escanear o ingresar un código de bobina.', 'warning');
        return;
    }
    
    if (!this.registroActual.velocidad || this.registroActual.velocidad <= 0) {
        Swal.fire('Falta Velocidad', 'Ingrese la velocidad de la máquina (debe ser mayor a 0).', 'warning');
        return;
    }

    if (!this.registroActual.horaInicio || !this.registroActual.horaFin) {
        Swal.fire('Faltan Horas', 'Debe indicar la hora de inicio y fin.', 'warning');
        return;
    }

    if (this.registroActual.cajas <= 0) {
        Swal.fire('Cantidad Inválida', 'La cantidad de cajas debe ser mayor a 0.', 'warning');
        return;
    }

    if (!this.registroActual.pesoPromedio || this.registroActual.pesoPromedio <= 0) {
        Swal.fire('Falta Peso', 'Ingrese el peso promedio (g).', 'warning');
        return;
    }
    
    const inicioSecuencia = this.contadorCajasAcumulado + 1;
    this.contadorCajasAcumulado += this.registroActual.cajas;

    this.listaDetalles.push({ 
        ...this.registroActual,
        inicioSecuencia: inicioSecuencia,
        id: null 
    });
    
    this.registroActual.cajas = 0;
    this.registroActual.rechazoKg = 0;
    this.registroActual.pesoPromedio = 0;
    this.registroActual.bobinaFin = false;
    this.registroActual.horaInicio = this.registroActual.horaFin; 
    this.registroActual.horaFin = '';
  }

  limpiarFormulario() {
    this.registroActual = {
      codigoBobina: '',
      loteBobina: '',
      nombreBobina: '',
      velocidad: 0,
      horaInicio: '',
      horaFin: '',
      cajas: 0,
      rechazoKg: 0,
      pesoPromedio: 0,
      bobinaFin: false
    };
  }

  guardarAvance() {
    if (this.listaDetalles.length === 0) {
      Swal.fire('Vacío', 'No hay registros para guardar.', 'info');
      return;
    }

    const dtosParaBackend = this.listaDetalles.map((item) => ({
      otId: this.otSeleccionada?.id,
      codigoBobina: item.codigoBobina,
      loteBobina: item.loteBobina,
      velocidad: item.velocidad,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      cajas: item.cajas,
      rechazoKg: item.rechazoKg,
      pesoPromedio: item.pesoPromedio,
      bobinaFin: item.bobinaFin,
    }));

    Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });

    this.otService.registrarAvance(dtosParaBackend).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Producción guardada correctamente.', 'success');

        this.listaDetalles = [];
        this.cargarOrdenesPendientes();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar el avance.', 'error');
      },
    });
  }

  imprimirEtiquetasFila(item: any) {
    Swal.fire({ title: 'Generando PDF...', didOpen: () => Swal.showLoading() });
    const itemParaImprimir = {
      ...item,
      otId: this.otSeleccionada?.id,
    };

    this.otService
      .imprimirEtiquetasSimuladas(itemParaImprimir, item.inicioSecuencia)
      .subscribe({
        next: (blob) => {
          Swal.close();
          this.descargarArchivo(blob, `Etiquetas_${item.codigoBobina}.pdf`);
        },
        error: () => {
          Swal.close();
          Swal.fire('Error', 'No se pudieron generar las etiquetas.', 'error');
        },
      });
  }

  imprimirReporteGeneral() {
    if (!this.otSeleccionada?.id) return;

    Swal.fire({
      title: 'Generando Reporte...',
      didOpen: () => Swal.showLoading(),
    });

    this.otService
      .descargarReporte(this.otSeleccionada.id, this.observacionesGenerales)
      .subscribe({
        next: (blob) => {
          Swal.close();
          this.descargarArchivo(
            blob,
            `Reporte_OT_${this.otSeleccionada?.codigo}.pdf`
          );
        },
        error: () => {
          Swal.close();
          Swal.fire('Error', 'No se pudo descargar el reporte.', 'error');
        },
      });
  }

  private descargarArchivo(blob: Blob, nombreArchivo: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
