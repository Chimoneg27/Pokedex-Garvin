import { PokemonRow } from '../../../services/models/pokemon-row';

export function mapToRows(rawData: any[]): PokemonRow[] {
  return rawData.map((raw: any): PokemonRow => {
    const stats = raw.pokemon_v2_pokemonstats;
    const getStat = (name: string) =>
      stats.find((s: any) => s.pokemon_v2_stat.name === name)?.base_stat ?? 0;

    const hp = getStat('hp');
    const attack = getStat('attack');
    const spAtk = getStat('special-attack');
    const spDef = getStat('special-defense');
    const speed = getStat('speed');

    return {
      name: raw.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raw.id}.png`,
      types: raw.pokemon_v2_pokemontypes.map((t: any) => t.pokemon_v2_type.name).join(', '),
      typeColor: raw.pokemon_v2_pokemonspecy?.pokemon_v2_pokemoncolor?.name ?? 'unknown',
      hp,
      attack,
      spAtk,
      spDef,
      speed,
      total: hp + attack + spDef + speed + spAtk,
    };
  });
}
