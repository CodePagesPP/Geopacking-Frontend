export type Products = 'EX' | 'TF'

export interface Product {
    id: number,
    code: string,
    name: string
}

export interface ProductoEX extends Product {
    tipo: 'EX'
}

export interface ProductoTF extends Product {
    tipo: 'TF'
}

export interface ProductCreateDTO {
    code: string,
    name: string,
}

export type ProductTypeMap = {
    'EX': ProductoEX,
    'TF': ProductoTF
}