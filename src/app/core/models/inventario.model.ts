export enum TipoMovimiento {
    INGRESO = 'INGRESO',
    SALIDA = 'SALIDA',
}

export enum OrigenMovimiento {
    SCRAPP = 'SCRAPP',
    MANUAL = 'MANUAL',
}

export interface InventarioMovimiento {
    id: number;
    codigoMovimiento: string;
    tipo: TipoMovimiento;
    origen: OrigenMovimiento;
    cantidad: number;
    fecha: string; // 'YYYY-MM-DD'
    fechaRegistro: string; // ISO string
    registradoPorNombre: string;
}

export interface InventarioManualDTO {
    tipo: TipoMovimiento;
    cantidad: number;
}

export interface InventarioStockDTO {
    stockActual: number;
}
