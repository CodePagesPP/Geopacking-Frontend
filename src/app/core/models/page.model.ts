// src/app/models/page.model.ts
export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // número de página actual (empieza en 0)
    first: boolean;
    last: boolean;
    empty: boolean;
}