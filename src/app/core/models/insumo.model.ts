import { Operacion, TipoRegistro } from "./inventario.model";

export interface InsumoRegistroDTO {
    id: number;
    cantidad: number;
    operacion: Operacion;
    tipoRegistro: TipoRegistro

    fecha: string;
    fechaRegistro: string;
    
    materialId: number;
    motivoId?: number;

    materialNombre: string;
    motivoNombre?: string;
    registradoPorNombre?: string;
}

export interface CreateInsumoDTO {
    materialId: number;
    cantidad: number;
    operacion: Operacion;
    fecha: string;

    motivoId?: number | null;
    nuevoMotivo?: string | null;
}

export interface PageInsumoDTO {
    content: InsumoRegistroDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}