import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pelicula {
  _id?: string;
  titulo: string;
  anio?: number;
  genero?: string;
  duracionMinutos?: number;
  calificacion?: number;
  imagenUrl?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  mongodb?: boolean;
}

export class MongoUnavailableError extends Error {
  constructor() {
    super('Please start Mongo DB');
    this.name = 'MongoUnavailableError';
  }
}

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  private readonly baseUrl = `${environment.apiUrl}/peliculas`;
  private readonly healthUrl = `${environment.apiUrl.replace('/api', '')}/api/health`;

  constructor(private http: HttpClient) {}

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(this.healthUrl).pipe(catchError(this.handleError));
  }

  listar(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  crear(pelicula: Partial<Pelicula>): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.baseUrl, pelicula).pipe(catchError(this.handleError));
  }

  actualizar(id: string, pelicula: Partial<Pelicula>): Observable<Pelicula> {
    return this.http.put<Pelicula>(`${this.baseUrl}/${id}`, pelicula).pipe(catchError(this.handleError));
  }

  eliminar(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  consultarPorGenero(genero: string): Observable<{ genero: string; total: number; peliculas: Pelicula[] }> {
    return this.http
      .get<{ genero: string; total: number; peliculas: Pelicula[] }>(
        `${this.baseUrl}/consulta/genero/${encodeURIComponent(genero)}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (
      error.status === 503 ||
      error.error?.error === 'mongodb_unavailable' ||
      error.error?.message === 'Please start Mongo DB'
    ) {
      return throwError(() => new MongoUnavailableError());
    }
    return throwError(() => error);
  }
}
