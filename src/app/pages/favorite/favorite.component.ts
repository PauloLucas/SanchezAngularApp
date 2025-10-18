import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Character } from '../../core/models/sanchez.types';
import { SanchezApiService } from '../../core/services/sanchez-api.service';
import { Store } from '@ngrx/store';
import { selectFavoritesIds, selectIsFavoriteById } from '../../states/favorites/favorites.selectors';
import { RouterLink } from '@angular/router';
import { distinctUntilChanged, firstValueFrom, map, of, switchMap, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesActions } from '../../states/favorites/favorites.actions';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  results: Character[] = [];
  loading = false;
  errorMsg: string | null = null;
  
  private api = inject(SanchezApiService);
  private store = inject(Store);
  favoritesIds: number[] = [];

  ngOnInit(): void {
    this.logFavoritesIds();
  }
  
  async logFavoritesIds() {
    this.loading = true;
    this.favoritesIds = await firstValueFrom(this.store.select(selectFavoritesIds));
    if(this.favoritesIds.length > 0){
      this.api.getCharactersFavorites(this.favoritesIds).subscribe(
        data => { 
          if (Array.isArray(data)) {
            this.results = data;
          } else {
            this.results.push(data);
          }
          this.loading = false;
        }
      );
    } else this.loading = false;
  }

  isFav(id: number) {
    return this.store.select(selectIsFavoriteById(id));
  }

  toggleFavorite(id: number, character: Character) {
    this.store.select(selectIsFavoriteById(id)).pipe(take(1)).subscribe(isFav => {
      this.store.dispatch(
        isFav ? FavoritesActions.remove({ id }) : FavoritesActions.add({ character })
      );
    });
  }

}
