import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { RegistroScrapp, ScrappRegistroDTO } from '../models/scrapp.model';
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
}
