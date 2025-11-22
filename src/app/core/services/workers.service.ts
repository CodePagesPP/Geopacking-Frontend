import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Operador, Reporte, UserRequest, UserResponse } from '../models/worker.model';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
 private apiUrl = `${environment.apiUrl}/users`; 
   constructor(private http: HttpClient, private authService: AuthService) { }

  
   getAll(role?: string): Observable<UserResponse[]> {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<UserResponse[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params: params 
    });
  }

  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  create(payload: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, payload, {
      headers: this.authService.getAuthHeaders()
    });
  }

  update(id: number, payload: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, payload, {
      headers: this.authService.getAuthHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

}
