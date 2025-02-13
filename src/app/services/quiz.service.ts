import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Quizzes} from "../models/quizz.model";
import {Question} from "../models/question.model";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  submitQuizResult(quizResult: any): Observable<any> {
    const url = `${this.apiUrl}/quiz-results/submit`;
    const token = this.getToken();
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = this.createHeaders(token);

    return this.http.post(url, quizResult, { headers }).pipe(
      catchError((error) => {
        console.error('Error submitting quiz result:', error);
        return throwError(() => new Error('Failed to submit quiz result.'));
      })
    );
  }

  getQuizResultsByUser(userId: number): Observable<any> {
    const token = this.getToken();
    const url = `${this.apiUrl}/quiz-results/user-results`;
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }
    const headers = this.createHeaders(token);
    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching quiz results:', error);
        return throwError(() => new Error('Failed to fetch quiz results.'));
      })
    );
  }

  deleteQuizResult(resultId: number): Observable<any> {
    const token = this.getToken();
    const url = `${this.apiUrl}/quiz-results/${resultId}`;
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = this.createHeaders(token);

    return this.http.delete(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting quiz result:', error);
        return throwError(() => new Error('Failed to delete quiz result.'));
      })
    );
  }

  calculateScore(selectedAnswers: { [questionId: number]: string }, id: number): Observable<{ score: number; total: number }> {
    return this.getQuestions(id).pipe(
      map((questions) => {
    let score = 0;
    const total = questions.length;

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });

    return { score, total };
      }),
      catchError((error) => {
        console.error('Error calculating score:', error);
        return throwError(() => new Error('Failed to calculate score.'));
      })
    );
  }


  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private quizHistory: any[] = [
    { title: 'Math Quiz', score: 85, date: new Date() },
    { title: 'Science Quiz', score: 90, date: new Date() },
  ];

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  getQuizzes(): Observable<Quizzes[]> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = this.createHeaders(token);
    const url = `${this.apiUrl}/quizzes`;

    return this.http.get<Quizzes[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching quizzes:', error);
        return throwError(() => new Error('Failed to fetch quizzes.'));
      })
    );
  }

  getQuestions(id: number): Observable<Question[]> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
  }

    const headers = this.createHeaders(token);
    const url = `${this.apiUrl}/questions/quiz/${id}`;

    return this.http.get<Question[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching questions:', error);
        return throwError(() => new Error('Failed to fetch questions.'));
      })
    );
  }
}
