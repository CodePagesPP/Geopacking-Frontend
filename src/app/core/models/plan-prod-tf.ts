import { Material } from './tool.model';

export interface OrdenTrabajoTF {
    id?: number;
    codigo?: string;
    fechaCreacion?: string;

    maquinaId: number;
    productoId: number;
    creadaPorId: number;
    requerimientoKg: number;

    maquinaNombre?: string;
    productoNombre?: string;

    productoBaseNombre?: string;

    creadaPorUsername?: string;
    producidoKg?: number;
    estado?: 'EN_ESPERA' | 'EN_PROCESO' | 'COMPLETADO';
    prioridad?: number;
}
