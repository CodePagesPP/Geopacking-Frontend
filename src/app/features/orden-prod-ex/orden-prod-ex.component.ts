import { Component, OnInit } from '@angular/core';
import { Bobina, MaterialEX, OrdenTrabajoEX, TurnoHistorial } from '../../core/models/plan-prod-ex';
import { CommonModule } from '@angular/common';
import { PlanProdExService } from '../../core/services/plan-prod-ex.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TypeScrapp } from '../../core/models/tool.model';
import { ToolService } from '../../core/services/tool.service';
import { AuthService } from '../../core/services/auth.service';

export interface Scrapp {
  tipo: string; 
  cantidad: number;
}
@Component({
  selector: 'app-orden-prod-ex',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './orden-prod-ex.component.html',
  styleUrl: './orden-prod-ex.component.css'
})
export class OrdenProdEXComponent implements OnInit {

  listaOTs: OrdenTrabajoEX[] = [];
  otSeleccionada: OrdenTrabajoEX | null = null;
  historialTurnos: TurnoHistorial[] = [];
  

  bobinasTurno: Bobina[] = [];
  materialesTurno: MaterialEX[] = [];
  listaScrapp: Scrapp[] = [];


  nuevaBobina: Bobina = { pesoBruto: 0, pesoNeto: 0, horaInicio: '', horaFin: '' };
  nuevoMaterial: MaterialEX = { nombre: '', cantidadKg: 0 };
  nuevoScrapp: Scrapp = { tipo: '', cantidad: 0 };
  comentariosTurno: string = '';


  tiposScrappDisponibles: TypeScrapp[] = [];
  usuarioNombre: string = 'Cargando...';

  constructor(
    private otService: PlanProdExService, 
    private toolService: ToolService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarOrdenesReales();
    this.cargarTiposScrapp();
    this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado() {
    this.authService.getUserInfo().subscribe({
      next: (user: any) => {
        this.usuarioNombre = `${user.name} ${user.lastName}`; 
        console.log('Usuario cargado:', this.usuarioNombre);
      },
      error: (err) => {
        console.error('Error al obtener perfil', err);
        this.usuarioNombre = 'Operador Desconocido';
      }
    });
  }


  cargarOrdenesReales() {
    this.otService.listarot().subscribe({
      next: (data) => {
        
        this.listaOTs = data; 
        console.log('OTs cargadas:', data);
      },
      error: (err) => {
        console.error('Error al conectar con el backend:', err);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }

  cargarTiposScrapp() {
    this.toolService.getAll('TypeScrapp').subscribe({
      next: (data) => {
        this.tiposScrappDisponibles = data;
        console.log('Tipos de scrapp cargados:', data);
      },
      error: (err) => console.error('Error al cargar tipos de scrapp', err)
    });
  }


  onDrop(event: CdkDragDrop<OrdenTrabajoEX[]>) {
    moveItemInArray(this.listaOTs, event.previousIndex, event.currentIndex);
    this.guardarCambiosDePrioridad();
  }

  guardarCambiosDePrioridad() {
    this.otService.actualizarOrden(this.listaOTs).subscribe({
      next: () => console.log('Prioridad actualizada en BD'),
      error: (err) => alert('Error al guardar el nuevo orden')
    });
  }

  esIniciable(index: number): boolean {
    return index < 3;
  }


  seleccionarOT(ot: OrdenTrabajoEX) {
    if (this.otSeleccionada && this.otSeleccionada.id !== ot.id) {
       const confirmar = confirm(`Ya tienes la OT ${this.otSeleccionada.codigo} en proceso. ¿Deseas cambiar?`);
       if (!confirmar) return;
    }
    this.otSeleccionada = ot;
    this.recuperarDatosLocales(ot.id!);
    this.cargarHistorial(ot.id!);
  }


  registrarBobina() {
    if (!this.otSeleccionada || this.nuevaBobina.pesoNeto <= 0) return;

    const correlativo = this.bobinasTurno.length + 1;
    const codigoGen = `${this.otSeleccionada.codigo}-B${correlativo}`;

    this.bobinasTurno.push({
      codigo: codigoGen,
      pesoBruto: this.nuevaBobina.pesoBruto,
      pesoNeto: this.nuevaBobina.pesoNeto,
      horaInicio: this.nuevaBobina.horaInicio,
      horaFin: this.nuevaBobina.horaFin
    });

    this.guardarEnLocal(); 
    
    this.nuevaBobina = { pesoBruto: 0, pesoNeto: 0, horaInicio: '', horaFin: '' };
  }

  registrarMaterial() {
    if (this.nuevoMaterial.cantidadKg <= 0 || !this.nuevoMaterial.nombre) return;
    
    this.materialesTurno.push({ ...this.nuevoMaterial });
    this.guardarEnLocal();
    
    this.nuevoMaterial = { nombre: '', cantidadKg: 0 };
  }

  registrarScrapp() {
    if (!this.nuevoScrapp.tipo || this.nuevoScrapp.cantidad <= 0) return;

    this.listaScrapp.push({ ...this.nuevoScrapp });
    this.guardarEnLocal(); 
    
    this.nuevoScrapp = { tipo: '', cantidad: 0 };
  }


  get totalKilosMaterial(): number {
    return this.materialesTurno.reduce((acc, m) => acc + m.cantidadKg, 0);
  }


  get totalKilosTurno(): number {
    return this.bobinasTurno.reduce((acc, b) => acc + b.pesoNeto, 0);
  }


  get porcentajeEficiencia(): number {
      if (this.totalBalanceKilos === 0) return 0;
      return 100; 
  }

  get totalBalanceKilos(): number {
    return this.totalKilosMaterial + this.totalKilosScrapp;
  }


  get totalKilosScrapp(): number {
    return this.listaScrapp.reduce((acc, s) => acc + s.cantidad, 0);
  }


  get balanceEficiencia(): number {
    const totalEntrada = this.totalKilosMaterial;
    
    
    const totalSalida = this.totalKilosScrapp; 
    
    if (totalEntrada === 0) return 0;
    
    
    return (totalSalida / totalEntrada) * 100;
  }



  guardarEnLocal() {
    if (!this.otSeleccionada) return;
    const otId = this.otSeleccionada.id;
    localStorage.setItem(`temp_bobinas_${otId}`, JSON.stringify(this.bobinasTurno));
    localStorage.setItem(`temp_materiales_${otId}`, JSON.stringify(this.materialesTurno));
    localStorage.setItem(`temp_scrapp_${otId}`, JSON.stringify(this.listaScrapp));
  }

  recuperarDatosLocales(otId: number) {
    const keyB = `temp_bobinas_${otId}`;
    const keyM = `temp_materiales_${otId}`;
    const keyS = `temp_scrapp_${otId}`;
    
    const b = localStorage.getItem(keyB);
    const m = localStorage.getItem(keyM);
    const s = localStorage.getItem(keyS);

    this.bobinasTurno = b ? JSON.parse(b) : [];
    this.materialesTurno = m ? JSON.parse(m) : [];
    this.listaScrapp = s ? JSON.parse(s) : [];
  }



  cargarHistorial(otId: number) {
    this.otService.obtenerHistorial(otId).subscribe(data => this.historialTurnos = data);
  }

  finTurno() {
    if (!this.otSeleccionada) return;
    if (this.bobinasTurno.length === 0) {
      alert("No hay bobinas registradas. Debe registrar producción.");
      return;
    }

    const payload = {
      otId: this.otSeleccionada.id,
      bobinas: this.bobinasTurno,
      materiales: this.materialesTurno,
      scrapp: this.listaScrapp,
      comentarios: this.comentariosTurno,
      usuarioNombre: this.usuarioNombre
    };

    this.otService.finalizarTurno(payload).subscribe({
      next: (blob: Blob) => {
        alert('Turno finalizado con éxito. Descargando reporte PDF...');
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Turno_${this.otSeleccionada!.codigo}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
       

        const otId = this.otSeleccionada!.id;
        localStorage.removeItem(`temp_bobinas_${otId}`);
        localStorage.removeItem(`temp_materiales_${otId}`);
        localStorage.removeItem(`temp_scrapp_${otId}`);
        
        this.bobinasTurno = [];
        this.materialesTurno = [];
        this.listaScrapp = [];
        this.comentariosTurno = '';
        
        this.cargarHistorial(otId!);
        this.cargarOrdenesReales(); 
      },
      error: (e) => {
        console.error(e);
        alert('Error al finalizar turno. Verifique conexión.');
      }
    });
  }
}