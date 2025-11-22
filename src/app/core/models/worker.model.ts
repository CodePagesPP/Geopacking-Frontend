export interface UserResponse {
  id: number;
  dni: string;
  name: string;
  lastName: string;
  role: string; // "OPERADOR", "AYUDANTE", "ADMIN"
  sex: string;
  createdAt: string; 
  updatedAt?: string;
}

export interface UserRequest {
  dni: string;
  name: string;
  lastName: string;
  sex: string;
  password?: string;
  role: string; 
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