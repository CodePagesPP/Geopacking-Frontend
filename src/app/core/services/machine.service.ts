import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateExtrusoraDto, CreateMolinoDto, CreateTermoformadoraDto, Extrusora, Maquina, Molino, Termoformadora } from '../models/machines.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaquinaService {

  
  private apiUrl = `${environment.apiUrl}/maquinas`; 

  constructor(private http: HttpClient, private authService: AuthService) { }

 
  getMaquinas(): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(this.apiUrl, {
    headers: this.authService.getAuthHeaders()
  });
  }

  getMaquinasActivas(): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(`${this.apiUrl}/activas`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getMaquinaById(id: number): Observable<Maquina> {
    return this.http.get<Maquina>(`${this.apiUrl}/${id}`, {
    headers: this.authService.getAuthHeaders()
  });
  }

  
  deleteMaquina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

 
  createExtrusora(data: CreateExtrusoraDto): Observable<Extrusora> {
    return this.http.post<Extrusora>(`${this.apiUrl}/extrusora`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createTermoformadora(data: CreateTermoformadoraDto): Observable<Termoformadora> {
    return this.http.post<Termoformadora>(`${this.apiUrl}/termoformadora`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createMolino(data: CreateMolinoDto): Observable<Molino> {
    return this.http.post<Molino>(`${this.apiUrl}/molino`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  
  updateExtrusora(id: number, data: Extrusora): Observable<Extrusora> {
    return this.http.put<Extrusora>(`${this.apiUrl}/extrusora/${id}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateTermoformadora(id: number, data: Termoformadora): Observable<Termoformadora> {
    return this.http.put<Termoformadora>(`${this.apiUrl}/termoformadora/${id}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateMolino(id: number, data: Molino): Observable<Molino> {
    return this.http.put<Molino>(`${this.apiUrl}/molino/${id}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
