import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {UserService} from "../services/user.service";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isLoggedIn = false;
  private token: string | null = null;
  private apiUrl = 'http://localhost:8080/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient,
              private  userService: UserService) {}

  register(user: User): Observable<string> {
    this.loggedIn.next(false);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, user, { headers }).pipe(
      map(response => response.message),
      catchError((error) => {
        let errorMessage = 'Registration failed; please try again.';
        if (error.status === 400) {
          errorMessage = 'This email or username is already registered.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(username: string, password: string): Observable<string> {
    this.loggedIn.next(true);
    if (!username || !password) {
      return throwError(() => new Error('Username and password are required'));
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string, user: User }>(`${this.apiUrl}/login`, { username, password }, { headers }).pipe(
      map(response => {
        this.token = response.token;
        localStorage.setItem('token', response.token);
        this.isLoggedIn = true;

        this.userService.updateUser(response.user).subscribe(
          updatedUser => {
            console.log("User updated:", updatedUser);
          },
          error => {
            console.error("Failed to update user:", error);
          }
        );

        return 'Login successful';
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error.message || 'Invalid username or password';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.token = null;
    this.loggedIn.next(false);
    localStorage.removeItem('token');
  }
}
