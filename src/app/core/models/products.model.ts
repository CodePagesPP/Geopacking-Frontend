import { Color, Material } from "./tool.model";

export type Products = 'EX' | 'TF'

export interface ProductBase {
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
  color: Color | null;
}

export interface ProductoEX extends ProductBase {
    material: Material | null;
}

export interface ProductoTF extends ProductBase {
    productoBase: ProductoEX | null;
}

export type Product = ProductoEX | ProductoTF;

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