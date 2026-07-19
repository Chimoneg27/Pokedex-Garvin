# Pokedex Garvin

A Pokédex and team-builder built with Angular 22, Angular Material, and a custom RxJS-based state layer (no NgRx/Akita/NgXS). Pokémon data comes live from the public [PokéAPI GraphQL endpoint](https://beta.pokeapi.co/graphql/v1beta); teams are managed against a local GraphQL API.

## Features

- **Pokédex browser** — searchable, filterable table of Pokémon (name, height, weight, type, color, base stats) fetched via Apollo GraphQL from PokéAPI.
- **Team builder** — create named teams tied to a trainer ID, with team name uniqueness validation.
- **Team list** — view and delete existing teams.
- Client-side state managed through small `BehaviorSubject`-backed stores (`PokemonStore`, `TeamsStore`) exposed as observables/signals — built by hand instead of a state management library.
- Server-side rendering (SSR) support via Angular's `@angular/ssr`.

## Tech stack

- **Framework:** Angular 22 (standalone components, signals, `@if`/`@for` control flow)
- **UI:** Angular Material + Tailwind CSS v4
- **Data layer:** Apollo Angular / GraphQL (PokéAPI) + a local GraphQL API for teams
- **State management:** Custom RxJS stores (`BehaviorSubject` + selectors), no NgRx/Akita/NgXS
- **Testing:** Vitest

## Prerequisites

- Node.js (LTS) and npm
- A local GraphQL server for team data, listening on `http://localhost:4000` (this repo does not include that server itself; `db/db.js` contains the seed data — trainers and teams — that such a server should read from, e.g. via a tool like [`json-graphql-server`](https://github.com/marmelab/json-graphql-server))

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local GraphQL server for team data on port 4000, seeded from `db/db.js`. For example, with `json-graphql-server`:
   ```bash
   npx json-graphql-server db/db.js
   ```

3. Start the Angular dev server:
   ```bash
   npm start
   ```

4. Open `http://localhost:4200` in your browser. The app reloads automatically on source changes.

Pokémon data itself requires no local server — it's fetched directly from PokéAPI's public GraphQL endpoint.

## Available scripts

| Command | Description |
|---|---|
| `npm start` | Runs `ng serve` — local dev server at `localhost:4200` |
| `npm run build` | Production build, output to `dist/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Runs unit tests with Vitest |
| `npm run serve:ssr:Pokedex-Garvin` | Serves the built SSR app (`node dist/Pokedex-Garvin/server/server.mjs`) |

## Project structure

```
src/app/
├── components/
│   ├── header/            # Top nav bar
│   └── pokedex-table/     # Reusable Pokémon table component
├── products/
│   ├── pokedex/           # Pokédex page: search + table, backed by PokemonStore
│   └── teams/             # Team builder + list, backed by TeamsStore
└── services/
    ├── graphql/           # GraphQL queries/mutations (PokéAPI + teams API)
    └── models/            # Shared TypeScript interfaces
db/
└── db.js                  # Seed data (trainers, teams) for the local teams GraphQL server
```

## Routes

| Path | Component |
|---|---|
| `/` | Pokédex browser |
| `/teams` | Team builder & team list |

## License

See [LICENSE](./LICENSE).