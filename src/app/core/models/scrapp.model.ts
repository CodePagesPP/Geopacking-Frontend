import { User } from "./auth.model";
import { Maquina } from "./machines.model";

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
}

export interface ScrappRegistroDTO {
  maquinaId: number;
  pesoBruto: number;
  pesoNeto: number;
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