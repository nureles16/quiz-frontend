import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

export interface User {
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


  constructor(private http: HttpClient) {}

  register(user: User): Observable<string> {
    this.loggedIn.next(false);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, user, { headers }).pipe(
      map(response => response.message),
      catchError((error) => {
        // Customize error messages based on status code or error details
        let errorMessage = 'Registration failed; please try again.';
        if (error.status === 400) {
          errorMessage = 'This email or username is already registered.';
        }
        return throwError(() => new Error(errorMessage)); // Pass error message without logging
      })
    );
  }


  login(username: string, password: string): Observable<string> {
    this.loggedIn.next(true);
    if (!username || !password) {
      return throwError(() => new Error('Username and password are required'));
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }, { headers }).pipe(
      map(response => {
        this.token = response.token;
        this.isLoggedIn = true;
        return 'Login successful';
      }),
      catchError((error: HttpErrorResponse) => {
        // Customize the error message without logging
        const errorMessage = error.error.message || 'Invalid username or password';
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  setLoginState(state: boolean) {
    this.loggedIn.next(state);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.token = null;
    this.loggedIn.next(false);
    console.log('User logged out');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
