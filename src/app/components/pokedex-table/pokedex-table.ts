import { Component, signal, SimpleChanges } from '@angular/core';
import { PokemonRow } from '../../services/models/pokemon-row';
import { Input } from '@angular/core';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-pokedex-table',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSortModule,
  ],
  templateUrl: './pokedex-table.html',
  styleUrl: './pokedex-table.css',
})
export class PokedexTable {
  @Input() dataSource: PokemonRow[] = [];
  displayedColumns: string[] = [
    'sprite',
    'name',
    'types',
    'hp',
    'attack',
    'spAtk',
    'spDef',
    'speed',
    'total',
  ];

  currentSort: Sort = { active: '', direction: '' };
  sortedData = signal(this.dataSource.slice());

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      this.applySort(this.currentSort);
    }
  }

  sortData(sort: Sort) {
    this.currentSort = sort;
    this.applySort(sort);
  }

  private applySort(sort: Sort) {
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData.set(data);
      return;
    }
    this.sortedData.set(
      data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name':
            return compare(a.name, b.name, isAsc);
          case 'types':
            return compare(a.types, b.types, isAsc);
          case 'hp':
            return compare(a.hp, b.hp, isAsc);
          case 'spAtk':
            return compare(a.spAtk, b.spAtk, isAsc);
          case 'spDef':
            return compare(a.spDef, b.spDef, isAsc);
          case 'speed':
            return compare(a.speed, b.speed, isAsc);
          case 'total':
            return compare(a.total, b.total, isAsc);
          case 'attack':
            return compare(a.attack, b.attack, isAsc);
          default:
            return 0;
        }
      }),
    );
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
