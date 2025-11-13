import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ProductoDTO, Products, ProductTypeMap } from '../models/products.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getEndpoint(productType: Products): string {
    switch (productType) {
      case 'EX': return 'prodEX';
      case 'TF': return 'prodTF';
      default: throw new Error('Invalid product type');
    }
  }

  getAll<K extends Products>(productType: K): Observable<ProductTypeMap[K][]> {
    const endpoint = this.getEndpoint(productType);
    return this.http.get<ProductTypeMap[K][]>(`${this.apiUrl}/${endpoint}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  findByCode<K extends Products>(code: string, productType: K): Observable<ProductTypeMap[K][]> {
    const endpoint = this.getEndpoint(productType);
    const params = new HttpParams().set('code', code);
    return this.http.get<ProductTypeMap[K][]>(`${this.apiUrl}/${endpoint}/${code}`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    });
  }

  findByName<K extends Products>(name: string, productType: K): Observable<ProductTypeMap[K][]> {
    const endpoint = this.getEndpoint(productType);
    const params = new HttpParams().set('name', name);
    return this.http.get<ProductTypeMap[K][]>(`${this.apiUrl}/${endpoint}/nombre/${name}`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    });
  }

  create<K extends Products>(data: ProductoDTO, productType: K): Observable<ProductTypeMap[K]> {
    const endpoint = this.getEndpoint(productType);
    return this.http.post<ProductTypeMap[K]>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  update<K extends Products>(code: string, data: ProductoDTO, productType: K): Observable<ProductTypeMap[K]> {
    const endpoint = this.getEndpoint(productType);
    return this.http.put<ProductTypeMap[K]>(`${this.apiUrl}/${endpoint}/${code}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  delete<K extends Products>(code: string, productType: K): Observable<void> {
    const endpoint = this.getEndpoint(productType);
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${code}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
