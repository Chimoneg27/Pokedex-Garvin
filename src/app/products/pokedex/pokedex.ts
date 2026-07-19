import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Apollo } from 'apollo-angular';
import { GET_POKEMON } from '../../services/graphql/queries';
import { PokemonStore } from './state/pokemon.store';
import { selectPokemon, selectLoading, selectError } from './state/pokemon.selectors';
import { mapToRows } from './state/pokemon.mapper';
import { PokedexTable } from '../../components/pokedex-table/pokedex-table';
import { PokemonRow } from '../../services/models/pokemon-row';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokedex',
  imports: [
    MatTableModule,
    PokedexTable,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex {
  // graphql section
  private apollo = inject(Apollo);
  private store = inject(PokemonStore);

  protected readonly dataSource = toSignal(selectPokemon(this.store), { initialValue: [] });
  protected readonly loading = toSignal(selectLoading(this.store), { initialValue: false });
  protected readonly error = toSignal(selectError(this.store), { initialValue: null });

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

  // searchbar section
  protected readonly searchTerm = signal('');
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly liveSearch = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  constructor() {
    this.fetchPokemon(0, 898);
  }

  protected readonly filteredPokemon = computed((): PokemonRow[] => {
    const term = this.liveSearch().toLowerCase().trim();
    if (!term) return this.dataSource();
    return this.dataSource().filter((p) => p.name.toLowerCase().includes(term));
  });

  protected readonly filteredNames = computed(() => {
    const term = this.liveSearch().toLowerCase().trim();
    if (!term) return this.dataSource().map((p) => p.name);
    return this.dataSource()
      .map((p) => p.name)
      .filter((name) => name.toLowerCase().includes(term));
  });

  protected clearSearch() {
    this.searchTerm.set('');
  }
}
