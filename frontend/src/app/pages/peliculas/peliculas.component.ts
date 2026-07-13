import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MongoUnavailableError, Pelicula, PeliculaService } from '../../services/pelicula.service';
import { UiButtonComponent } from '../../components/ui/button.component';
import { UiInputComponent } from '../../components/ui/input.component';
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../components/ui/card.component';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  templateUrl: './peliculas.component.html',
})
export class PeliculasComponent implements OnInit {
  form!: FormGroup;
  peliculas: Pelicula[] = [];
  cargando = false;
  error = '';
  mensaje = '';
  generoConsulta = 'Drama';
  resultadoConsulta: Pelicula[] = [];
  mongoUnavailable = false;

  constructor(
    private fb: FormBuilder,
    private peliculaService: PeliculaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      anio: [new Date().getFullYear()],
      genero: ['Drama'],
      imagenUrl: [''],
    });
    this.cargarPeliculas();
  }

  cargarPeliculas(): void {
    this.cargando = true;
    this.error = '';
    this.mongoUnavailable = false;

    this.peliculaService.listar().subscribe({
      next: (data) => {
        this.peliculas = data;
        this.cargando = false;
      },
      error: (err) => this.handleError(err),
    });
  }

  agregarPelicula(): void {
    if (this.form.invalid || this.mongoUnavailable) return;

    const { titulo, anio, genero, imagenUrl } = this.form.value;
    const payload: Partial<Pelicula> = { titulo, anio, genero };
    if (imagenUrl?.trim()) payload.imagenUrl = imagenUrl.trim();

    this.peliculaService.crear(payload).subscribe({
      next: () => {
        this.mensaje = `"${titulo}" añadida correctamente.`;
        this.form.patchValue({ titulo: '', imagenUrl: '' });
        this.cargarPeliculas();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: (err) => this.handleError(err, 'Error al añadir la película.'),
    });
  }

  eliminarPelicula(pelicula: Pelicula): void {
    if (!pelicula._id || this.mongoUnavailable) return;
    this.peliculaService.eliminar(pelicula._id).subscribe({
      next: () => {
        this.mensaje = `"${pelicula.titulo}" eliminada.`;
        this.cargarPeliculas();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: (err) => this.handleError(err, 'Error al eliminar la película.'),
    });
  }

  consultarPorGenero(): void {
    if (this.mongoUnavailable) return;
    this.peliculaService.consultarPorGenero(this.generoConsulta).subscribe({
      next: (res) => {
        this.resultadoConsulta = res.peliculas;
        this.mensaje = `Consulta: ${res.total} película(s) de género "${res.genero}".`;
        setTimeout(() => (this.mensaje = ''), 4000);
      },
      error: (err) => this.handleError(err, 'Error en la consulta por género.'),
    });
  }

  private handleError(err: unknown, fallback = ''): void {
    this.cargando = false;
    if (err instanceof MongoUnavailableError) {
      this.mongoUnavailable = true;
      this.error = '';
      return;
    }
    this.error = fallback || 'No se pudo conectar con la API.';
  }
}
