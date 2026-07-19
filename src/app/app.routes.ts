import { Routes } from '@angular/router';
import { Pokedex } from './products/pokedex/pokedex';
import { Teams } from './products/teams/teams';

export const routes: Routes = [
  { path: '', component: Pokedex },
  { path: 'teams', component: Teams },
  { path: '**', redirectTo: '' },
];
