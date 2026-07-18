import { Component, computed, effect, inject, resource } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { GET_POKEMON } from '../../services/graphql/queries';
import { PokemonRow } from '../../services/models/pokemon-row';
import { firstValueFrom, filter, map, take } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  imports: [MatTableModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex {
  private apollo = inject(Apollo);

  private offset = 0; // this is the the starting point for my data fetch
  private limit = 10;

  protected readonly allPokemon = resource({
    params: () => ({ offset: this.offset, limit: this.limit }),
    loader: ({ params }) =>
      firstValueFrom(
        this.apollo
          .watchQuery({
            query: GET_POKEMON,
            variables: { offset: params.offset, limit: params.limit },
          })
          .valueChanges.pipe(
            filter((result: any) => !result.loading),
            take(1),
            map((result: any) => {
              console.log('raw-result:', result);
              if (result.error) {
                throw result.error; // rejects the promise instead of hanging
              }
              const rawData = result.data?.pokemon_v2_pokemon ?? [];
              return rawData.map((raw: any): PokemonRow => {
                const stats = raw.pokemon_v2_pokemonstats;
                const getStat = (name: string) =>
                  stats.find((s: any) => s.pokemon_v2_stat.name === name)?.base_stat ?? 0;
                const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raw.id}.png`;

                const typeString = raw.pokemon_v2_pokemontypes
                  .map((t: any) => t.pokemon_v2_type.name)
                  .join(', ');

                const typeColor =
                  raw.pokemon_v2_pokemonspecy?.pokemon_v2_pokemoncolor?.name ?? 'unknown';

                const hp = getStat('hp');
                const attack = getStat('attack');
                const spAtk = getStat('special-attack');
                const spDef = getStat('special-defense');
                const speed = getStat('speed');

                return {
                  name: raw.name,
                  sprite: spriteUrl,
                  types: typeString,
                  typeColor: typeColor,
                  hp: hp,
                  attack: attack,
                  spAtk: spAtk,
                  spDef: spDef,
                  speed: speed,
                  total: hp + attack + spDef + speed + spAtk,
                };
              });
            }),
          ),
      ),
  });

  private readonly = effect((): void => {
    console.log('the data', this.dataSource);
  });
  protected readonly dataSource = computed(() => this.allPokemon.value() ?? []);
}
