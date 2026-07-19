import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexTable } from './pokedex-table';

describe('PokedexTable', () => {
  let component: PokedexTable;
  let fixture: ComponentFixture<PokedexTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PokedexTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
