import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getColecciones(): Observable<{ colecciones: string[] }> {
    return this.http.get<{ colecciones: string[] }>(`${environment.apiUrl.replace('/api', '')}/api/colecciones`.replace('/api/api', '/api'));
  }

  listar<T>(coleccion: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${coleccion}`);
  }

  crear<T>(coleccion: string, documento: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${coleccion}`, documento);
  }

  actualizar<T>(coleccion: string, id: string, documento: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${coleccion}/${id}`, documento);
  }

  eliminar(coleccion: string, id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${coleccion}/${id}`);
  }
}
