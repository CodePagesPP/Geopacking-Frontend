import { Material } from "./tool.model";

export interface OrdenTrabajoEX {
    id?: number;
    codigo?: string;
    fechaCreacion?: string; 
    
    maquinaId: number;
    productoId: number;
    creadaPorId: number; 
    requerimientoKg: number;
  
    maquinaNombre?: string; 
    productoNombre?: string;
    creadaPorUsername?: string;
    producidoKg?: number;
    estado?: 'EN_ESPERA' | 'EN_PROCESO' | 'COMPLETADO';
    prioridad?: number;
    materialesProducto?: Material[];
}

export interface Bobina {
  codigo?: string;
  pesoBruto: number;
  pesoNeto: number;
  horaInicio: string; 
  horaFin: string; 
}

export interface BobinaHistorialDTO {
  fecha: string;
  codigoBobina: string;
  operacion: string;
  codigoProducto: string;
  operador: string;
  pesoBruto: number;
  pesoNeto: number;
}

export interface MaterialEX {
  nombre: string;
  cantidadKg: number;
}

export interface TurnoHistorial {
    id: number;
    fechaHoraFin: string;
    totalKilosProducidos: number;
    cantidadBobinas: number;
}

export interface BobinaTransito {
    id: number;
    codigoBobina: string;
    nombreProducto: string;
    pesoBruto: number;
    pesoNeto: number;
    producidoPor: string;
    fecha: string; 
    codigoOT: string;
}