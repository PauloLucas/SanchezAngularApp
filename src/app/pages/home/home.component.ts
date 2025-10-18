import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, take, tap } from 'rxjs';
import { SanchezApiService } from '../../core/services/sanchez-api.service';
import { Character } from '../../core/models/sanchez.types';
import { Store } from '@ngrx/store';
import { selectFavoritesIds, selectIsFavoriteById } from '../../states/favorites/favorites.selectors';
import { FavoritesActions } from '../../states/favorites/favorites.actions';
import { MatIconModule } from '@angular/material/icon';
import { DialRadioComponent } from '../../shared/components/dial-radio/dial-radio.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, DialRadioComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  results: Character[] = [];
  private api = inject(SanchezApiService);
  private store = inject(Store);
  isFav$ = this.store.select(selectIsFavoriteById(0));

  // testar inclusão dos favoritos
  favoritesIds$ = this.store.select(selectFavoritesIds);

  totalPages: number = 0;
  page: number = 0;

  searchCtrl = new FormControl<string>('', { nonNullable: true });

  loading = false;

  constructor() {}
  
  ngOnInit(): void {
    this.getCharacters();

    this.page = 1;

    this.searchCtrl.valueChanges.pipe(
      map(v => (v ?? '').trim()),
      filter(v => v !== ''),
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        this.loading = true;
        this.results = [];
      }),
    )
    .subscribe(
      value => {
        this.searchCtrl.setValue(value);
        this.findCharacters(1, value);
      }
    );
  }

  onDialChange(PageNum: number){
    this.page = PageNum;

    if (this.searchCtrl.getRawValue() !== '')
      this.findCharacters(PageNum, this.searchCtrl.getRawValue());
    else
      this.getCharacters(PageNum);

  }

  findCharacters(pagina: number, nome: string){
    if(nome !== ''){
      this.api.getCharacters({page: pagina, name: nome}).subscribe(
        data => {
          this.totalPages = data.info.pages;
          this.results = data.results;
        }
      );
      this.loading = false;
    }
  }

  getCharacters(pagina: number = 1, nome: string = ''){
    this.api.getCharacters({page: pagina, name: nome}).subscribe(
      data => { 
        this.totalPages = data.info.pages;
        this.results = data.results;
      }
    );
  }

  clear(){
    this.page = 1;
    this.searchCtrl.setValue('');
    this.getCharacters();
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
