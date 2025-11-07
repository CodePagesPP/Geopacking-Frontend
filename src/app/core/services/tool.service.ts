import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToolCreateDTO, Tools, ToolTypeMap } from '../models/tool.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  private apiUrl = environment.apiUrl; 
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getEndpoint(toolType: Tools): string {
    switch (toolType) {
      case 'Material': return 'materials';
      case 'Color': return 'colors';
      case 'Origen': return 'origins';
      case 'TypeScrapp': return 'typescrapp';
      default: throw new Error('Invalid tool type');
    }
  }

  getAll<K extends Tools>(toolType: K): Observable<ToolTypeMap[K][]> {
    const endpoint = this.getEndpoint(toolType);
    return this.http.get<ToolTypeMap[K][]>(`${this.apiUrl}/${endpoint}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  findByCode<K extends Tools>(code: string, toolType: K): Observable<ToolTypeMap[K][]> {
    const endpoint = this.getEndpoint(toolType);
    const params = new HttpParams().set('code', code);
    return this.http.get<ToolTypeMap[K][]>(`${this.apiUrl}/${endpoint}`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    });
  }

  findByName<K extends Tools>(name: string, toolType: K): Observable<ToolTypeMap[K][]> {
    const endpoint = this.getEndpoint(toolType);
    const params = new HttpParams().set('name', name);
    return this.http.get<ToolTypeMap[K][]>(`${this.apiUrl}/${endpoint}`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    });
  }

  create<K extends Tools>(data: ToolCreateDTO, toolType: K): Observable<ToolTypeMap[K]> {
    const endpoint = this.getEndpoint(toolType);
    return this.http.post<ToolTypeMap[K]>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  update<K extends Tools>(code: string, data: ToolCreateDTO, toolType: K): Observable<ToolTypeMap[K]> {
    const endpoint = this.getEndpoint(toolType);
    return this.http.put<ToolTypeMap[K]>(`${this.apiUrl}/${endpoint}/${code}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  delete(code: string, toolType: Tools): Observable<void> {
    const endpoint = this.getEndpoint(toolType);
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${code}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
