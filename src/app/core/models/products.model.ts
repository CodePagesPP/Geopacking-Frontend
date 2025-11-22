import { Color, Material } from "./tool.model";

export type Products = 'EX' | 'TF'

export interface Product {
  id: number;
  name: string;
  code: string;
  referencia: string;
  marca: string;
  linea: string;
  categoria: string;
  unidadDeMedida: string;
  pesoUnitario?: number;
  activo: boolean;
  material?: Material | null;      // Para TF
  materiales?: Material[];
  color: Color | null;
}

export interface ProductoEX extends Product {
    tipo: 'EX',
    materiales: Material[];
}

export interface ProductoTF extends Product {
    tipo: 'TF',
    material: Material;
}

export interface ProductoDTO {
  id?: number;
  name: string;
  code: string;
  referencia: string;
  marca: string;
  linea: string;
  categoria: string;
  unidadDeMedida: string;
  pesoUnitario: number | null;
  activo: boolean;
  materialId: number | null;      // ID único para TF
  materialesIds: number[];
  colorId: number | null;
}

export type ProductTypeMap = {
    'EX': ProductoEX,
    'TF': ProductoTF
}