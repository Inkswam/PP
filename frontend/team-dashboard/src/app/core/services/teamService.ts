//
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Team, CreateTeamRequest } from '../models/team.model';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class TeamService {
//   private apiUrl = 'http://localhost:5084/api/teams';
//
//   constructor(private http: HttpClient) {}
//
//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     if (token) {
//       return new HttpHeaders({
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       });
//     }
//     return new HttpHeaders({
//       'Content-Type': 'application/json'
//     });
//   }
//
//   /** Отримати всі команди користувача */
//   getAllTeams(): Observable<Team[]> {
//     return this.http.get<Team[]>(this.apiUrl, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }
//
//   /** Створити нову команду */
//   createTeam(teamData: CreateTeamRequest): Observable<Team> {
//     return this.http.post<Team>(this.apiUrl, teamData, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }
//
//   /** Отримати команду по ID */
//   getTeamById(id: number): Observable<Team> {
//     return this.http.get<Team>(`${this.apiUrl}/${id}`, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }
//
//   /** Оновити команду */
//   updateTeam(id: number, teamData: Partial<Team>): Observable<Team> {
//     return this.http.put<Team>(`${this.apiUrl}/${id}`, teamData, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }
//
//   /** Видалити команду */
//   deleteTeam(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, CreateTeamRequest } from '../models/team.model';
import { User } from './userService';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:5084/api/teams';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /** Отримати всі команди користувача */
  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Створити нову команду */
  createTeam(teamData: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, teamData, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Отримати команду по ID */
  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Оновити команду */
  updateTeam(id: number, teamData: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, teamData, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Видалити команду */
  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Отримати всіх учасників команди */
  getTeamParticipants(teamId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${teamId}/participants`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Додати учасника до команди */
  addParticipant(teamId: number, participantId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/participants/${participantId}`, {}, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Видалити учасника з команди */
  removeParticipant(teamId: number, participantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}/participants/${participantId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Приєднатися до команди */
  joinTeam(teamId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/join`, {}, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  /** Покинути команду */
  leaveTeam(teamId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/leave`, {}, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
