export interface UserResponse {
  id: number;
  dni: string;
  name: string;
  lastName: string;
  role: string;
  createdAt: string; 
  updatedAt?: string;
}


export interface Operador {
  dni: string;
  password?: string; 
  name: string;
  lastName: string;
  sex: string;
}


export interface Reporte {
  dni: string;
  password?: string;
  name: string;
  lastName: string;
  sex: string;
}