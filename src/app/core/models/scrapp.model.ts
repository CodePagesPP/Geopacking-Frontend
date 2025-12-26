import { User } from "./auth.model";
import { Maquina } from "./machines.model";
import { Origen, TypeScrapp } from "./tool.model";

export interface RegistroScrapp {
  id: number;
  numeroBolson: number;
  anio: number;
  pesoBruto: number;
  pesoNeto: number;
  fechaCreacion: string;
  horaCreacion: string;
  turno: string;
  maquina: Maquina;
  operador: User;
  typeScrapp?: TypeScrapp;
  origen?: Origen;
  observaciones?: string;
}

export interface ScrappRegistroDTO {
  maquinaId: number;
  origenId: number;
  typeScrappId: number;
  pesoBruto: number;
  pesoNeto: number;
  observaciones?: string;
}

export interface ScrappReportDTO {
  registros: RegistroScrapp[];
  totalPesoBruto: number;
  totalPesoNeto: number;
}

export interface PaginatedScrappReportDTO {
  registros: RegistroScrapp[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  totalPesoBruto: number;
  totalPesoNeto: number;
}