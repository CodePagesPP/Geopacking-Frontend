import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateInsumoDTO, InsumoRegistroDTO } from '../models/insumo.model';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private apiUrl = `${environment.apiUrl}/insumos`;

  constructor(private authService: AuthService, private http: HttpClient) { }

  registrar(dto: CreateInsumoDTO): Observable<InsumoRegistroDTO> {
    return this.http.post<InsumoRegistroDTO>(this.apiUrl, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listar(page: number = 0, size:number = 10, fechaInicio?: string, fechaFin?: string, materialId?: number): Observable<Page<InsumoRegistroDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (fechaInicio) {
      params = params.set('inicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fin', fechaFin);
    }

    if (materialId) {
      params = params.set('materialId', materialId.toString());
    }

    return this.http.get<Page<InsumoRegistroDTO>>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  obtenerStock(materialId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stock/${materialId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
