import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'favorites', loadComponent: () => import('./pages/favorite/favorite.component').then(c => c.FavoriteComponent) },
  { path: '**', redirectTo: '' }
];
