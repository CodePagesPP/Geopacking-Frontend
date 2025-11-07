export enum Operacion {
    INGRESO = 'INGRESO',
    SALIDA = 'SALIDA',
}

export enum TipoRegistro {
    SCRAPP = 'SCRAPP',
    MANUAL = 'MANUAL',
}

export interface InventarioMovimiento {
    id: number;
    codigoMovimiento: string;
    operacion: Operacion;
    tipoRegistro: TipoRegistro;
    cantidad: number;
    fecha: string; // 'YYYY-MM-DD'
    fechaRegistro: string; // ISO string
    typeScrappNombre: string;
    registradoPorNombre: string;
}

export interface InventarioManualDTO {
    operacion: Operacion;
    cantidad: number;
    typeScrappId: number;
}

export interface InventarioStockDTO {
    stockActual: number;
}
