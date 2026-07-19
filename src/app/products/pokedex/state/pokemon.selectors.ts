import { map } from "rxjs";
import { PokemonStore } from "./pokemon.store";

// pipe streamlines a bunch of transform steps into one clean chain
//map reshapes each value as needed
export const selectPokemon = (store: PokemonStore) =>
  store.state$.pipe(map((state) => state.pokemon))

export const selectLoading = (store: PokemonStore) =>
  store.state$.pipe(map((state) => state.loading))

export const selectError = (store: PokemonStore) =>
  store.state$.pipe(map((state) => state.error))

export const selectOffset = (store: PokemonStore) =>
  store.state$.pipe(map((state) => state.offset))

export const selecLimit = (store: PokemonStore) =>
  store.state$.pipe(map((state)=> state.limit))