import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs";
import { TeamShape } from "../../../services/models/team-shape";

interface TeamsState {
  teams: TeamShape[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null
}

@Injectable({ providedIn: 'root' })
export class TeamsStore {

  // source of truth only visible to this store
  private state$$ = new BehaviorSubject<TeamsState>(initialState)

  // our public selectors, think of them as streams
  readonly state$ = this.state$$.asObservable();
  readonly teams$ = this.state$.pipe(map(state => state.teams));
  readonly loading$ = this.state$.pipe(map(state => state.loading))
  readonly error$ = this.state$.pipe(map(state => state.error))

  private get currentState(): TeamsState {
    return this.state$$.getValue()
  }

  private patchState(partial: Partial<TeamsState>): void {
    this.state$$.next({ ...this.currentState, ...partial })
  }

  setLoading(loading: boolean): void {
    this.patchState({ loading, error:null })
  }

  setTeams(teams: TeamShape[]): void {
    this.patchState({ teams, loading:false, error: null })
  }

  setError(error: string): void {
    this.patchState({ error, loading: false })
  }


  setAddTeam(team: TeamShape): void {
    this.patchState({
      teams: [...this.currentState.teams, team],
      loading: false,
      error: null
    })
  }

  setRemoveTeam(id: number): void {
    this.patchState({
      teams: this.currentState.teams.filter((t) => t.id !== id),
      loading: false,
      error: null
    })
  }
}