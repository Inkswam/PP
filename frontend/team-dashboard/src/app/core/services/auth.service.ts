

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/core/services/userService';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5084/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // При ініціалізації сервісу, якщо є токен - завантажуємо дані користувача
    this.initializeUser();
  }

  private initializeUser(): void {
    if (this.isLoggedIn()) {
      this.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => {
          // Якщо не вдалося завантажити користувача - очищаємо токени
          this.clearAuthData();
        }
      });
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/login', { username, password }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        // Якщо бекенд повертає токен, зберігаємо його
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        // Якщо бекенд повертає user info, зберігаємо дані користувача (з перевірками)
        if (response.user) {
          if (response.user.username) {
            localStorage.setItem('username', response.user.username);
          }
          if (response.user.id !== undefined) {
            localStorage.setItem('userId', response.user.id.toString());
          }
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('http://localhost:5084/api/auth/me', {
      withCredentials: true
    }).pipe(
      tap(user => {
        // Оновлюємо localStorage та BehaviorSubject (з перевіркою на undefined)
        if (user && user.id !== undefined) {
          localStorage.setItem('userId', user.id.toString());
        }
        if (user && user.username) {
          localStorage.setItem('username', user.username);
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  // Новий метод для отримання ID поточного користувача
  getCurrentUserId(): number | null {
    // Спочатку пробуємо взяти з localStorage
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      const userId = parseInt(userIdFromStorage, 10);
      if (!isNaN(userId)) {
        return userId;
      }
    }

    // Якщо в localStorage немає, пробуємо взяти з BehaviorSubject
    const currentUser = this.currentUserSubject.value;
    if (currentUser && currentUser.id !== undefined) {
      return currentUser.id;
    }

    // Якщо ніде немає - повертаємо null
    return null;
  }

  // Метод для отримання об'єкта поточного користувача
  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  // Метод для отримання username
  getCurrentUsername(): string | null {
    const username = localStorage.getItem('username');
    if (username) return username;

    const currentUser = this.currentUserSubject.value;
    return currentUser?.username || null;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  private clearAuthData(): void {
    // Очищаємо localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');

    // Очищаємо BehaviorSubject
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    // Перевіряємо і токен, і cookies
    return !!this.getToken() || this.hasCookieAuth();
  }

  private hasCookieAuth(): boolean {
    // Перевіряємо чи є jwt cookie (простий спосіб)
    return document.cookie.includes('jwt=');
  }

  // Метод для перевірки чи користувач є власником ресурсу
  isOwner(ownerId: number): boolean {
    const currentUserId = this.getCurrentUserId();
    return currentUserId === ownerId;
  }
}
