import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 
import { OrdenTrabajoEX, TurnoHistorial } from '../models/plan-prod-ex';

@Injectable({
  providedIn: 'root'
})
export class PlanProdExService {

  private apiUrl = `${environment.apiUrl}/orden-trabajo-ex`; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  crear(orden: OrdenTrabajoEX): Observable<OrdenTrabajoEX> {
    return this.http.post<OrdenTrabajoEX>(`${this.apiUrl}/crear`, orden, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listar(): Observable<OrdenTrabajoEX[]> {
    return this.http.get<OrdenTrabajoEX[]>(`${this.apiUrl}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listarprioridad(): Observable<OrdenTrabajoEX[]> {
    return this.http.get<OrdenTrabajoEX[]>(`${this.apiUrl}/list-pri`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  actualizarOrden(lista: OrdenTrabajoEX[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ordenar`, lista, {
      headers: this.authService.getAuthHeaders()
    });
  }



finalizarTurno(datos: any): Observable<Blob> { 
  return this.http.post(`${this.apiUrl.replace('/orden-trabajo-ex', '')}/turno-ex/finalizar`, datos, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob' 
  });
}

  obtenerHistorial(otId: number): Observable<TurnoHistorial[]> {
    return this.http.get<TurnoHistorial[]>(`${this.apiUrl.replace('/orden-trabajo-ex', '')}/turno-ex/historial/${otId}`, {
        headers: this.authService.getAuthHeaders()
    });
  }
}