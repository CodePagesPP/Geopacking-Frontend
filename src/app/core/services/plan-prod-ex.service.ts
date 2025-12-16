import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 
import { OrdenTrabajoEX } from '../models/plan-prod-ex';

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
}