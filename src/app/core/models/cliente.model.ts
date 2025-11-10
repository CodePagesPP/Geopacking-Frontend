export interface Cliente {
    id: number;
    tipoCliente: string;
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    nombreComercial?: string;
    pais?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    fechaNacimiento?: string;
    creditoHabilitado: boolean;
    montoCredito?: number;
    observacion?: string;
    contactoNombre?: string;
    contactoTelefono?: string;
}

export type ClienteDTO = Omit<Cliente, 'id'>;