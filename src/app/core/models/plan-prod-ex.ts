import { Maquina } from "./machines.model";
import { ProductoDTO } from "./products.model";

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
}