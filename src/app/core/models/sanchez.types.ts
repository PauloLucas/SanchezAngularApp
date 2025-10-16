export interface RetornoApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RetornoApiResponse {
  info: RetornoApiInfo;
  results: Character[];
}

export interface FavoritesState {
  entities: Record<number, Character>;
  ids: number[];
}