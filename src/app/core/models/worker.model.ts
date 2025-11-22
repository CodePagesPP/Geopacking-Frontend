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

// Lo que envías al Backend (POST/PUT)
export interface UserRequest {
  dni: string;
  name: string;
  lastName: string;
  sex: string;
  password?: string;
  role: string; // <--- IMPORTANTE: Campo obligatorio ahora
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