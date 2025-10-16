import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Character } from '../../core/models/sanchez.types';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent {
  results = signal<Character[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  trackById = (_: number, c: any) => c.id;
}
