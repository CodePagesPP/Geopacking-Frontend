export interface AuthRequest {
  dni: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User{
  id: number;
  name: string;
  lastName: string;
  sex: string;
  dni: string;
  createdAt: Date;
  updatedAt: Date;
}