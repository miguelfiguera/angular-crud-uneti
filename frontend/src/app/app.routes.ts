import { Routes } from '@angular/router';
import { PeliculasComponent } from './pages/peliculas/peliculas.component';

export const routes: Routes = [
  { path: '', component: PeliculasComponent },
  { path: '**', redirectTo: '' },
];
