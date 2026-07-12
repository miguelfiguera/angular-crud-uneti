import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pelicula {
  _id?: string;
  titulo: string;
  anio?: number;
  genero?: string;
  duracionMinutos?: number;
  calificacion?: number;
}

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  private readonly baseUrl = `${environment.apiUrl}/peliculas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.baseUrl);
  }

  crear(pelicula: Partial<Pelicula>): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.baseUrl, pelicula);
  }

  actualizar(id: string, pelicula: Partial<Pelicula>): Observable<Pelicula> {
    return this.http.put<Pelicula>(`${this.baseUrl}/${id}`, pelicula);
  }

  eliminar(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  consultarPorGenero(genero: string): Observable<{ genero: string; total: number; peliculas: Pelicula[] }> {
    return this.http.get<{ genero: string; total: number; peliculas: Pelicula[] }>(
      `${this.baseUrl}/consulta/genero/${encodeURIComponent(genero)}`
    );
  }
}
