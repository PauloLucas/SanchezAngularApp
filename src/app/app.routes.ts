import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
  { path: 'favorites', loadComponent: () => import('./pages/favorite/favorite.component').then(c => c.FavoriteComponent) },
  { path: '**', redirectTo: '' }
];
