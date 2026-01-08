import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { OrdenTrabajoTF } from '../models/plan-prod-tf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanProdTfService {

  private apiUrl = `${environment.apiUrl}/orden-trabajo-tf`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  crear(orden: OrdenTrabajoTF): Observable<OrdenTrabajoTF> {
    return this.http.post<OrdenTrabajoTF>(`${this.apiUrl}/crear`, orden, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listar(): Observable<OrdenTrabajoTF[]> {
    return this.http.get<OrdenTrabajoTF[]>(`${this.apiUrl}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listarot(): Observable<OrdenTrabajoTF[]> {
    return this.http.get<OrdenTrabajoTF[]>(`${this.apiUrl}/ot`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listarprioridad(): Observable<OrdenTrabajoTF[]> {
    return this.http.get<OrdenTrabajoTF[]>(`${this.apiUrl}/list-pri`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  actualizarOrden(lista: OrdenTrabajoTF[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ordenar`, lista, {
      headers: this.authService.getAuthHeaders()
    });
  }

  editar(id: number, orden: OrdenTrabajoTF): Observable<OrdenTrabajoTF> {
    return this.http.put<OrdenTrabajoTF>(`${this.apiUrl}/editar/${id}`, orden, {
      headers: this.authService.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  registrarAvance(detalles: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/avance`, detalles, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  descargarEtiquetas(detalleId: number, inicioSecuencia: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/etiquetas/${detalleId}?inicioSecuencia=${inicioSecuencia}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  descargarReporte(otId: number, observaciones: string = ''): Observable<Blob> {
    const obsParam = encodeURIComponent(observaciones);
    return this.http.get(`${this.apiUrl}/reporte/${otId}?observaciones=${obsParam}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  obtenerInfoBobina(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar-bobina/${codigo}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  imprimirEtiquetasSimuladas(registro: any, inicioSecuencia: number): Observable<Blob> {
    const payload = {
        ...registro,
        otId: registro.otId
    };
    
    return this.http.post(`${this.apiUrl}/etiquetas/simular?inicioSecuencia=${inicioSecuencia}`, payload, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  listarHistorial(fechaInicio?: string, fechaFin?: string): Observable<any[]> {
    let params = '';
    if (fechaInicio && fechaFin) {
      params = `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/historial${params}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
