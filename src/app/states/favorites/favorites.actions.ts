import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Character } from '../../core/models/sanchez.types';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'add': props<{ character: Character }>(),
    'remove': props<{ id: number }>(),
    'clear': emptyProps(),
  },
});