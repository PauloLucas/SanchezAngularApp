import { createFeature, createReducer, on } from '@ngrx/store';
import { FavoritesActions } from './favorites.actions';
import { Character } from '../../core/models/sanchez.types';


export interface FavoritesState {
  entities: Record<number, Character>;
  ids: number[];
}

const initialState: FavoritesState = {
  entities: {},
  ids: [],
};

export const favoritesFeature = createFeature({
  name: 'favorites',
  reducer: createReducer(
    initialState,
    on(FavoritesActions.add, (state, { character }) => {
      if (state.entities[character.id]) return state;
      return {
        entities: { ...state.entities, [character.id]: character },
        ids: [...state.ids, character.id],
      };
    }),
    on(FavoritesActions.remove, (state, { id }) => {
      if (!state.entities[id]) return state;
      const { [id]: _, ...rest } = state.entities;
      return {
        entities: rest,
        ids: state.ids.filter(x => x !== id),
      };
    }),
    on(FavoritesActions.clear, () => initialState),
  ),
});
