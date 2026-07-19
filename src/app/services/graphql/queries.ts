import { gql } from 'apollo-angular';

export const GET_POKEMON = gql`
  query GetPokemon($limit: Int, $offset: Int) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      id
      name
      height
      weight

      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemoncolor {
          name
        }
      }

      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }

      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
    }
  }
`;

export const GET_ABILITIES = gql`
  query GetAbilities($pokemonId: Int) {
    pokemon_v2_pokemonability(where: { pokemon_id: { _eq: $pokemonId } }) {
      is_hidden
      pokemon_v2_ability {
        name # Raw slug name (e.g., "static")
        pokemon_v2_abilitynames(where: { language_id: { _eq: 9 } }) {
          name # Clean display name (e.g., "Static")
        }
        pokemon_v2_abilityeffecttexts(where: { language_id: { _eq: 9 } }) {
          short_effect
        }
      }
    }
  }
`;

export const GET_TEAMS = `
  query {
    allTeams {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`

export const CREATE_TEAM = ``
