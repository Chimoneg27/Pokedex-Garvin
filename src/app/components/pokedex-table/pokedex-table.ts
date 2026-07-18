import { Component } from '@angular/core';
import { PokemonRow } from '../../services/models/pokemon-row';
import { Input } from '@angular/core';
import {
  MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
} from '@angular/material/table';

@Component({
  selector: 'app-pokedex-table',
  imports: [MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef],
  templateUrl: './pokedex-table.html',
  styleUrl: './pokedex-table.css',
})

export class PokedexTable {
  @Input() dataSource: PokemonRow[] = []
  displayedColumns: string[] = ['sprite', 'name', 'types', 'hp', 'attack', 'spAtk', 'spDef', 'speed', 'total']
}
