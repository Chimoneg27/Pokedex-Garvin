import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Pokedex } from './pokedex/pokedex';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Pokedex],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Pokedex-Garvin');
}
