import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/quiz-results';

  constructor(private http: HttpClient) {}

  getFeedbackByQuizId(quizId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any>(`${this.apiUrl}/user-results/${quizId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching feedback:', error);
        return throwError(() => new Error('Failed to fetch feedback.'));
      })
    );
  }
}
