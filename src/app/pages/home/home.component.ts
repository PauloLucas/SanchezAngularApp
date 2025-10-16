import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, take, tap } from 'rxjs';
import { SanchezApiService } from '../../core/services/sanchez-api.service';
import { Character } from '../../core/models/sanchez.types';
import { Store } from '@ngrx/store';
import { selectFavoritesIds, selectIsFavoriteById } from '../../states/favorites/favorites.selectors';
import { FavoritesActions } from '../../states/favorites/favorites.actions';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input({ required: true }) character!: Character;

  private api = inject(SanchezApiService);
  
  private store = inject(Store);
  isFav$ = this.store.select(selectIsFavoriteById(0));

  // testar inclusão dos favoritos
  favoritesIds$ = this.store.select(selectFavoritesIds);

  searchCtrl = new FormControl<string>('', { nonNullable: true });

  results = signal<Character[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor() {
    this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      debounceTime(350),
      distinctUntilChanged(),
      tap(() => { this.loading.set(true); this.errorMsg.set(null); }),
      switchMap(name => 
        this.api.getCharacters({ name: name || undefined, page: 1 }).pipe(
          catchError(err => {
            if (name && err?.status === 404) {
              this.results.set([]);
              this.errorMsg.set('Nada foi encontrado');
            } else if (err) {
              this.results.set([]);
              this.errorMsg.set('Ocorreu um erro. Tente novamente.');
            }
            return of(null);
          })
        )
      ),
      tap(() => this.loading.set(false))
    ).subscribe(resp => {
      if (!resp) return;
      this.results.set(resp.results);
      // this.results.set([]);
      this.errorMsg.set(null);
    });
  }

  ngOnChanges(): void {
    if (this.character?.id != null) {
      this.isFav$ = this.store.select(selectIsFavoriteById(this.character.id));
    }
  }

  // toggleFavorite(ev: Event) {
  //   ev.stopPropagation();
  //   let isFavNow: boolean | undefined;
  //   const sub = this.isFav$.subscribe(v => isFavNow = v);
  //   sub.unsubscribe();

  //   if (isFavNow) {
  //     this.store.dispatch(FavoritesActions.remove({ id: this.character.id }));
  //   } else {
  //     this.store.dispatch(FavoritesActions.add({ character: this.character }));
  //   }
  // }

  isFav(id: number) {
    return this.store.select(selectIsFavoriteById(id)); // Observable<boolean>
  }

  toggleFavorite(id: number, character: Character) {
    this.store.select(selectIsFavoriteById(id)).pipe(take(1)).subscribe(isFav => {
      this.store.dispatch(
        isFav ? FavoritesActions.remove({ id }) : FavoritesActions.add({ character })
      );
    });
  }

  trackById = (_: number, c: any) => c.id;
}
