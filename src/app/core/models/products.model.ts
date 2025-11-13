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
  pesoUnitario: number;
  activo: boolean;
  material: Material | null;
  color: Color | null;
}

export interface ProductoEX extends Product {
    tipo: 'EX'
}

export interface ProductoTF extends Product {
    tipo: 'TF'
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
  materialId: number | null;
  colorId: number | null;
}

export type ProductTypeMap = {
    'EX': ProductoEX,
    'TF': ProductoTF
}