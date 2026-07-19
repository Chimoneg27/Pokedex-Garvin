import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeamsStore } from './state/team.store';
import { CREATE_TEAM, DELETE_TEAM, GET_TEAMS } from '../../services/graphql/queries';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, take, map } from 'rxjs';
import { TeamShape } from '../../services/models/team-shape';

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
  private formBuilder = inject(FormBuilder);

  teams$ = toSignal(this.store.teams$, { initialValue: [] });
  loading$ = toSignal(this.store.loading$, { initialValue: false });
  error$ = toSignal(this.store.error$, { initialValue: null });

  teamForm = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      [uniqueTeamNameValidator(this.store)],
    ],
    trainer_id: [null as number | null, Validators.required],
  });

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

  createTeam(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    const { name, trainer_id } = this.teamForm.value;

    this.http
      .post<any>(this.apiUrl, {
        query: CREATE_TEAM,
        variables: {
          name,
          trainer_id,
          created_at: new Date().toISOString(),
        },
      })
      .subscribe({
        next: (response) => {
          if (response.errors) {
            this.store.setError(response.errors[0].message);
          }

          this.store.setAddTeam(response.data.createTeam);
          this.teamForm.reset();
        },
        error: () => {
          this.store.setError('Failed to create');
        },
      });
  }

  constructor() {
    this.fetchTeams();
  }

  // delete a team
  selectedTeam = signal<TeamShape | null>(null);

  deleteTeam(): void {
    const team = this.selectedTeam();
    if (!team) return;

    this.http
      .post<any>(this.apiUrl, {
        query: DELETE_TEAM,
        variables: { id: team.id },
      })
      .subscribe({
        next: (response) => {
          if (response.errors) {
            this.store.setError(response.errors[0].message);
            return;
          }
          this.store.setRemoveTeam(team.id);
          this.selectedTeam.set(null);
        },
        error: () => {
          this.store.setError('Failed to delete team');
        },
      });
  }

  onDeleteTeam(team: TeamShape) {
    this.selectedTeam.set(this.selectedTeam()?.id === team.id ? null : team);
  }
}

function uniqueTeamNameValidator(store: TeamsStore) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return store.teams$.pipe(
      take(1), // only need the current snapshot, not every future emission
      map((teams) => {
        const nameTaken = teams.some(
          (t) => t.name.trim().toLowerCase() === control.value?.trim().toLowerCase(),
        );
        return nameTaken ? { notUnique: true } : null;
      }),
    );
  };
}