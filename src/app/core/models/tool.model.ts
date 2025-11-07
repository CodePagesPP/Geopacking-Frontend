export type Tools = 'Material'| 'Color' | 'Origen' | 'TypeScrapp'

export interface Tool {
    id: number,
    code: string,
    name: string
}

export interface Material extends Tool {
    tipo: 'Material'
}

export interface Color extends Tool {
    tipo: 'Color'
}

export interface Origen extends Tool {
    tipo: 'Origen'
}

export interface TypeScrapp extends Tool {
    tipo: 'TypeScrapp'
}
export interface ToolCreateDTO {
    code: string,
    name: string,
}

export type ToolTypeMap = {
    'Material': Material,
    'Color': Color,
    'Origen': Origen,
    'TypeScrapp': TypeScrapp
}