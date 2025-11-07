import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InventarioManualDTO, InventarioMovimiento, InventarioStockDTO } from '../models/inventario.model';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor(private authService: AuthService, private http: HttpClient) { }

  registrarMovimientoManual(dto: InventarioManualDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/manual`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  obtenerHistorial(page: number = 0, size: number = 10, fechaInicio?: string, fechaFin?: string, typeScrappId?: number): Observable<Page<InventarioMovimiento>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (typeScrappId) {
      params = params.set('typeScrappId', typeScrappId.toString());
    }

    return this.http.get<Page<InventarioMovimiento>>(`${this.apiUrl}/historial`, {headers: this.authService.getAuthHeaders(), params });
  }

  obtenerStockActual(): Observable<InventarioStockDTO> {
    return this.http.get<InventarioStockDTO>(`${this.apiUrl}/stock`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}

