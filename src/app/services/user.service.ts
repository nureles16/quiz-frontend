import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {User} from "../auth/auth.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, { headers }).pipe(
      tap((updatedUser) => {
        this.userSubject.next(updatedUser);
      }),
      catchError((error) => {
        let errorMessage = 'Failed to update user; please try again.';
        if (error.status === 400) {
          errorMessage = 'Invalid data provided.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    this.userSubject.next(null);
  }
}
