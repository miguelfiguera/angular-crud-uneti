import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pelicula, PeliculaService } from '../../services/pelicula.service';
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

  constructor(
    private fb: FormBuilder,
    private peliculaService: PeliculaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      anio: [new Date().getFullYear()],
      genero: ['Drama'],
    });
    this.cargarPeliculas();
  }

  cargarPeliculas(): void {
    this.cargando = true;
    this.error = '';
    this.peliculaService.listar().subscribe({
      next: (data) => {
        this.peliculas = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo conectar con la API. Verifica que MongoDB y el backend estén activos.';
        this.cargando = false;
      },
    });
  }

  agregarPelicula(): void {
    if (this.form.invalid) return;

    const { titulo, anio, genero } = this.form.value;
    this.peliculaService.crear({ titulo, anio, genero }).subscribe({
      next: () => {
        this.mensaje = `"${titulo}" añadida correctamente.`;
        this.form.patchValue({ titulo: '' });
        this.cargarPeliculas();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: () => {
        this.error = 'Error al añadir la película.';
      },
    });
  }

  eliminarPelicula(pelicula: Pelicula): void {
    if (!pelicula._id) return;
    this.peliculaService.eliminar(pelicula._id).subscribe({
      next: () => {
        this.mensaje = `"${pelicula.titulo}" eliminada.`;
        this.cargarPeliculas();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: () => {
        this.error = 'Error al eliminar la película.';
      },
    });
  }

  consultarPorGenero(): void {
    this.peliculaService.consultarPorGenero(this.generoConsulta).subscribe({
      next: (res) => {
        this.resultadoConsulta = res.peliculas;
        this.mensaje = `Consulta: ${res.total} película(s) de género "${res.genero}".`;
        setTimeout(() => (this.mensaje = ''), 4000);
      },
      error: () => {
        this.error = 'Error en la consulta por género.';
      },
    });
  }
}
