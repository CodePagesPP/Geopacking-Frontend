import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Cliente, ClienteDTO } from '../models/cliente.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getClientesPaginados(
    filtro: string,
    page: number,
    size: number
  ): Observable<Page<Cliente>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<Page<Cliente>>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params: params,
    });
  }

  exportClientes(filtro?: string): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();
    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get(`${this.apiUrl}/export/excel`, {
      headers: this.authService.getAuthHeaders(), 
      params: params,
      observe: 'response',     
      responseType: 'blob'     
    });
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getClienteByNumero(numero: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/documento/${numero}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createCliente(dto: ClienteDTO): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, dto, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateCliente(id: number, dto: ClienteDTO): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, dto, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getDepartamentos(): Observable<string[]> {
    const departamentosPeru = [
      'Amazonas',
      'Áncash',
      'Apurímac',
      'Arequipa',
      'Ayacucho',
      'Cajamarca',
      'Callao',
      'Cusco',
      'Huancavelica',
      'Huánuco',
      'Ica',
      'Junín',
      'La Libertad',
      'Lambayeque',
      'Lima',
      'Loreto',
      'Madre de Dios',
      'Moquegua',
      'Pasco',
      'Piura',
      'Puno',
      'San Martín',
      'Tacna',
      'Tumbes',
      'Ucayali',
    ];
    return new Observable((observer) => observer.next(departamentosPeru));
  }
}
