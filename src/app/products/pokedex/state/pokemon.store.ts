import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { PokemonRow } from "../../../services/models/pokemon-row";
import { PokemonState } from "../../../services/models/pokemons-state";

const initialState: PokemonState = {
  pokemon: [],
  offset: 0,
  limit: 10,
  loading: false,
  error: null
}

@Injectable({ providedIn: 'root' })
export class PokemonStore {
  // this is a private box, only the store can push new values into it
  private readonly state$$ = new BehaviorSubject<PokemonState>(initialState);

  // asObservable basically saying you can only read the values and not mutate them
  readonly state$ = this.state$$.asObservable();

  private get currentState(): PokemonState {
    return this.state$$.getValue();
  }

  readonly pokemon$ = this.state$.pipe(map(state => state.pokemon))

  // merging logic
  private patchState(partial: Partial<PokemonState>): void {
    this.state$$.next({ ...this.currentState, ...partial })
  }

  setLoading(loading: boolean): void {
    this.patchState({ loading, error:null })
  }

  setPokemon(pokemon: PokemonRow[]): void {
    this.patchState({ pokemon, loading:false, error: null })
  }

  setError(error: string): void {
    this.patchState({ error, loading: false })
  }

  setOffset(offset: number): void {
    this.patchState({ offset })
  }

  setLimit(limit: number): void {
    this.patchState({ limit })
  }
}