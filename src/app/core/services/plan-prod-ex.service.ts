import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 
import { BobinaHistorialDTO, BobinaTransito, OrdenTrabajoEX, TurnoHistorial } from '../models/plan-prod-ex';

@Injectable({
  providedIn: 'root'
})
export class PlanProdExService {

  private apiUrl = `${environment.apiUrl}/orden-trabajo-ex`; 
  private apiUrlBobinas = `${environment.apiUrl}/bobinas`; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  crear(orden: OrdenTrabajoEX): Observable<OrdenTrabajoEX> {
    return this.http.post<OrdenTrabajoEX>(`${this.apiUrl}/crear`, orden, {
      headers: this.authService.getAuthHeaders()
    });
  }


  editar(id: number, ot: OrdenTrabajoEX): Observable<OrdenTrabajoEX> {
    return this.http.put<OrdenTrabajoEX>(`${this.apiUrl}/editar/${id}`, ot, {
      headers: this.authService.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listar(page: number, size: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.maquinaId) params = params.set('maquinaId', filters.maquinaId);
    if (filters.productoId) params = params.set('productoId', filters.productoId);
    if (filters.estado) params = params.set('estado', filters.estado);
    if (filters.fechaDesde) params = params.set('fechaDesde', filters.fechaDesde);
    if (filters.fechaHasta) params = params.set('fechaHasta', filters.fechaHasta);

    return this.http.get<any>(`${this.apiUrl}`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  listarot(): Observable<OrdenTrabajoEX[]> {
    return this.http.get<OrdenTrabajoEX[]>(`${this.apiUrl}/ot`, {
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

  obtenerHistorialBobinas(page: number, size: number, fechaDesde?: string, fechaHasta?: string): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (fechaDesde) params = params.set('inicio', fechaDesde);
  if (fechaHasta) params = params.set('fin', fechaHasta);

  
  return this.http.get<any>(`${this.apiUrlBobinas}/historial`, {headers: this.authService.getAuthHeaders(), params });
}

descargarReporteStock(desde?: string, hasta?: string): Observable<Blob> {
  let params = new HttpParams();
  if (desde && hasta) {
    params = params.set('inicio', desde).set('fin', hasta);
  }

  return this.http.get(`${this.apiUrlBobinas}/reporte-pdf`, { 
    responseType: 'blob',
    headers: this.authService.getAuthHeaders(),
    params: params
  });
}

getBobinasTransito(): Observable<BobinaTransito[]> {
    return this.http.get<BobinaTransito[]>(`${this.apiUrlBobinas}/transito`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  descargarReporteStockPdf(fechaInicio?: string, fechaFin?: string): Observable<Blob> {
    let params = new HttpParams();
    
    
    if (fechaInicio) {
      params = params.set('inicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fin', fechaFin);
    }

    return this.http.get(`${this.apiUrlBobinas}/reporte-tabla-pdf`, {
      params: params,
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  obtenerStockTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrlBobinas}/stock`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  descargarReporteIndividual(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrlBobinas}/reporte-pdf/${id}`, { 
    responseType: 'blob',
    headers: this.authService.getAuthHeaders()
  });
}

obtenerCorrelativoBobina(otId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrlBobinas}/conteo/${otId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}