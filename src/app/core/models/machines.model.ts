import { Origen } from "./tool.model";

export type TipoMaquina = 'Extrusora' | 'Termoformadora' | 'Molino';


export interface Maquina {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  activo: boolean;
  tipo: TipoMaquina; 
}

export interface Extrusora extends Maquina {
  tipo: 'Extrusora';
  rendimiento: number;
}

export interface Termoformadora extends Maquina {
  tipo: 'Termoformadora';
  areaDeFormado: string;
}

export interface Molino extends Maquina {
  tipo: 'Molino';
  origenes: Origen[];
}


export interface CreateExtrusoraDto {
  codigo: string;
  marca: string;
  modelo: string;
  activo: boolean;
  rendimiento: number;
}

export interface CreateTermoformadoraDto {
  codigo: string;
  marca: string;
  modelo: string;
  activo: boolean;
  areaDeFormado: string;
}

export interface CreateMolinoDto {
  codigo: string;
  marca: string;
  modelo: string;
  activo: boolean;
  origenIds:number[];
}