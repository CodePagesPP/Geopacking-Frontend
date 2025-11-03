import { User } from "./auth.model";
import { Maquina } from "./machines.model";

export interface RegistroScrapp {
  id: number;
  numeroBolson: number;
  anio: number;
  pesoBruto: number;
  pesoNeto: number;
  fechaCreacion: string;
  turno: string;
  maquina: Maquina;
  operador: User;
}

export interface ScrappRegistroDTO {
  maquinaId: number;
  pesoBruto: number;
  pesoNeto: number;
}