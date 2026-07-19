import {
  Component,
  signal,
  SimpleChanges,
  ElementRef,
  viewChild,
  AfterViewInit,
  effect,
  computed,
} from '@angular/core';
import { PokemonRow } from '../../services/models/pokemon-row';
import { Input } from '@angular/core';
import { MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatFooterRow } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Chart, registerables } from 'chart.js';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
Chart.register(...registerables);

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
    MatPaginatorModule,
],
  templateUrl: './pokedex-table.html',
  styleUrl: './pokedex-table.css',
})
export class PokedexTable  {
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

  // card logic goes here
  selectedPokemon = signal<PokemonRow | null>(null);

  onClickRow(pokemon: PokemonRow) {
    this.selectedPokemon.set(this.selectedPokemon()?.name === pokemon.name ? null : pokemon);
  }

  closeCard() {
    this.selectedPokemon.set(null);
  }

  // this is for the charts
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('radarCanvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const pokemon = this.selectedPokemon();
      const canvas = this.canvasRef();
      if (pokemon && canvas) {
        this.renderChart(pokemon, canvas.nativeElement);
      } else if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    });
  }

  private renderChart(pokemon: PokemonRow, canvasEl: HTMLCanvasElement) {
    const canvas = this.canvasRef();
    if (!canvas) return;

    const data = {
      labels: ['SpAtk', 'SpDef', 'Attack', 'Speed', 'Hp'],
      datasets: [
        {
          label: pokemon.name,
          data: [pokemon.spAtk, pokemon.spDef, pokemon.attack, pokemon.speed, pokemon.hp],
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
        },
      ],
    };

     if (this.chart && this.chart.canvas === canvasEl) {
    // same canvas as before — just update the numbers
    this.chart.data = data;
    this.chart.update();
  } else {
    // no chart yet, or the old one belonged to a since-destroyed canvas
    this.chart?.destroy();
    this.chart = new Chart(canvasEl, {
      type: 'radar',
      data,
      options: {
        elements: { line: { borderWidth: 3 } },
        animations: {
          tension: { duration: 1000, easing: 'linear', from: 1, to: 0, loop: true },
        },
      },
    });
  }
  }

  // pagination
  pageIndex = signal(0);
  pageSize = signal(10);

  paginatedData = computed(() => {
    const data = this.sortedData();
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  })

  currentSort: Sort = { active: '', direction: '' };
  sortedData: any = signal(this.dataSource.slice());

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize)
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
