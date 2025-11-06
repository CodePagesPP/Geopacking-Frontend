import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedScrappReportDTO, RegistroScrapp, ScrappRegistroDTO, ScrappReportDTO } from '../models/scrapp.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrappService {
  private apiUrl = `${environment.apiUrl}/scrapp`;
  constructor(private authService: AuthService, private http: HttpClient) { }
  registrarScrapp(dto: ScrappRegistroDTO): Observable<RegistroScrapp> {
    return this.http.post<RegistroScrapp>(`${this.apiUrl}/registrar`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getRegistros(): Observable<RegistroScrapp[]> {
    return this.http.get<RegistroScrapp[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getEtiquetaPdf(registroId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/etiqueta/${registroId}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob' 
    });
  }

  getReportePaginado(page: number, size: number, fechaInicio?: string, fechaFin?: string): Observable<PaginatedScrappReportDTO> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<PaginatedScrappReportDTO>(`${this.apiUrl}/reporte-admin`, {headers: this.authService.getAuthHeaders(), params });
  }


  getReporteCompletoPdf(fechaInicio?: string, fechaFin?: string): Observable<Blob> {
    
    let params = new HttpParams();
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get(`${this.apiUrl}/reporte-completo-pdf`, {headers: this.authService.getAuthHeaders(), params, responseType: 'blob' });
  }
}
