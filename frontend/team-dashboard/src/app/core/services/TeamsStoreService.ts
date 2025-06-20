import { Injectable }     from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Team }            from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamsStoreService {
  private subject = new BehaviorSubject<Team[]>([]);
  readonly teams$ = this.subject.asObservable();

  setAll(teams: Team[]) { this.subject.next(teams); }
  add(team: Team)       { this.subject.next([...this.subject.value, team]); }
  remove(id: number)    {
    this.subject.next(this.subject.value.filter(t => t.id !== id));
  }
}
