import { PokemonRow } from "./pokemon-row";

export interface PokemonState {
  pokemon: PokemonRow[];
  offset: number;
  limit: number;
  loading: boolean;
  error: string | null;
}
