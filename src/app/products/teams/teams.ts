import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeamsStore } from './state/team.store';
import { CREATE_TEAM, GET_TEAMS } from '../../services/graphql/queries';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { response } from 'express';

@Component({
  selector: 'app-teams',
  imports: [MatProgressSpinner, MatButtonModule, ReactiveFormsModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})

export class Teams {
  private http = inject(HttpClient);
  private store = inject(TeamsStore);
  private apiUrl = 'http://localhost:4000';


  teams$ = toSignal(this.store.teams$, { initialValue: [] })
  loading$ = toSignal(this.store.loading$, { initialValue: false })
  error$ = toSignal(this.store.error$, { initialValue: null })


  fetchTeams(): void {
    this.store.setLoading(true);

    this.http.post<any>(this.apiUrl, { query: GET_TEAMS }).subscribe({
      next: (response) => {
        if (response.errors) {
          this.store.setError(response.errors[0].message);
          return;
        }
        this.store.setTeams(response.data.allTeams);
      },
      error: (err) => {
        console.error('HTTP ERROR:', err);
        this.store.setError('Failed to fetch teams');
      },
    });
  }



  constructor() {
    this.fetchTeams();
  }
}
