import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Operador, Reporte, UserResponse } from '../models/worker.model';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
 private operatorapiUrl = `${environment.apiUrl}/operadores`; 
private reportapiUrl = `${environment.apiUrl}/reportes`; 
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllOperators(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.operatorapiUrl, {
    headers: this.authService.getAuthHeaders()
  });
  }

  getByIdOperator(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.operatorapiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createOperator(payload: Operador): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.operatorapiUrl, payload, {
    headers: this.authService.getAuthHeaders()
  });
  }

  updateOperator(id: number, payload: Operador): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.operatorapiUrl}/${id}`, payload, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteOperator(id: number): Observable<void> {
    return this.http.delete<void>(`${this.operatorapiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }


  getAllReport(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.reportapiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getByIdReport(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.reportapiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createReport(payload: Reporte): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.reportapiUrl, payload, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateReport(id: number, payload: Reporte): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.reportapiUrl}/${id}`, payload, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.reportapiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
