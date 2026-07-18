import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { GET_POKEMON } from '../../services/graphql/queries';
import { PokemonStore } from './state/pokemon.store';
import { selectPokemon, selectLoading, selectError } from './state/pokemon.selectors';
import { mapToRows } from './state/pokemon.mapper';
import { PokedexTable } from '../../components/pokedex-table/pokedex-table';

@Component({
  selector: 'app-pokedex',
  imports: [MatTableModule, PokedexTable],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})

export class Pokedex {
  private apollo = inject(Apollo);
  private store = inject(PokemonStore);

  protected readonly dataSource = toSignal(selectPokemon(this.store), { initialValue: [] });
  protected readonly loading = toSignal(selectLoading(this.store), { initialValue: false });
  protected readonly error = toSignal(selectError(this.store), { initialValue: null });

  constructor() {
    this.fetchPokemon(0, 10);
  }

  private fetchPokemon(offset: number, limit: number): void {
    this.store.setLoading(true);

    this.apollo
      .watchQuery({ query: GET_POKEMON, variables: { offset, limit } })
      .valueChanges.subscribe({
        next: (result: any) => {
          if (result.loading) return;
          if (result.error) {
            this.store.setError(result.error.message);
            return;
          }
          this.store.setPokemon(mapToRows(result.data?.pokemon_v2_pokemon ?? []));
          this.store.setOffset(offset);
        },
      });
  }
}
