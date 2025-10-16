import { createSelector } from '@ngrx/store';
import { favoritesFeature } from './favorites.feature';

const { selectFavoritesState } = favoritesFeature;

export const selectFavoritesIds = createSelector(
  selectFavoritesState,
  s => s.ids
);

export const selectFavoritesEntities = createSelector(
  selectFavoritesState,
  s => s.entities
);

export const selectFavoritesCount = createSelector(
  selectFavoritesIds,
  ids => ids.length
);

// Factory selector: consulta “é favorito?” por id
export const selectIsFavoriteById = (id: number) =>
  createSelector(selectFavoritesEntities, entities => !!entities[id]);

export const selectFavoritesList = createSelector(
  selectFavoritesIds,
  selectFavoritesEntities,
  (ids, entities) => ids.map(id => entities[id])
);
