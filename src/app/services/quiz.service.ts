import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8080/api/quiz-results';
  constructor(private http: HttpClient) {}

  submitQuizResult(userId: number, quizResult: any): Observable<any> {
    const url = `${this.apiUrl}/submit?userId=${userId}`;
    return this.http.post(url, quizResult, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getQuizResultsByUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get(url);
  }

  // Example method in quiz.service.ts
  calculateScore(selectedAnswers: { [questionId: number]: string }, quizId: number): { score: number; total: number } {
    const questions = this.getQuestions(quizId);
    let score = 0;

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });

    return { score, total: questions.length };
  }


  private quizHistory: any[] = [
    { title: 'Math Quiz', score: 85, date: new Date() },
    { title: 'Science Quiz', score: 90, date: new Date() },
    // Add more quiz history as needed
  ];

  getUserQuizHistory(userId: number) {
    // Filter or fetch quiz history for the specific user
    return this.quizHistory; // Replace with actual fetching logic
  }
  getQuizzes() {
    return [
      { id: 1, subject: 'Math', title: 'Math Basics I', description: 'Covers fundamental math principles' },
      { id: 2, subject: 'Math', title: 'Math Basics II', description: 'Covers fundamental math principles' },
      { id: 3, subject: 'Science', title: 'Introduction to Physics', description: 'Basic concepts in physics' },
      { id: 4, subject: 'History', title: 'World History 101', description: 'A primer on significant historical events' }
    ];
  }

  getQuestions(quizId: number) {
    const questions: Record<number, { id: number; question: string; options: string[]; answer: string }[]> = {
      1: [
        { id: 101, question: 'What is 2 + 2?', options: ['2', '3', '4', '5'], answer: '4' },
        { id: 102, question: 'What is 5 * 5?', options: ['15', '25', '10', '20'], answer: '25' },
        { id: 103, question: 'What is 10 - 3?', options: ['6', '7', '8', '5'], answer: '7' },
        { id: 104, question: 'What is 12 ÷ 4?', options: ['3', '4', '5', '6'], answer: '3' },
        { id: 105, question: 'What is the square root of 16?', options: ['2', '4', '8', '3'], answer: '4' },
        { id: 106, question: 'What is 3^3?', options: ['6', '9', '27', '81'], answer: '27' },
        { id: 107, question: 'What is 15% of 200?', options: ['15', '20', '30', '25'], answer: '30' },
        { id: 108, question: 'What is the next prime number after 7?', options: ['9', '10', '11', '13'], answer: '11' },
        { id: 109, question: 'If a triangle has angles of 90° and 45°, what is the third angle?', options: ['45°', '60°', '30°', '90°'], answer: '45°' },
        { id: 110, question: 'What is the area of a rectangle with length 5 and width 4?', options: ['20', '25', '30', '15'], answer: '20' }
      ],
      2: [
        { id: 201, question: 'What is 7 + 5?', options: ['10', '12', '11', '13'], answer: '12' },
        { id: 202, question: 'What is 8 * 6?', options: ['42', '48', '54', '56'], answer: '48' },
        { id: 203, question: 'What is the value of 9 - 4?', options: ['3', '5', '6', '7'], answer: '5' },
        { id: 204, question: 'What is 20 ÷ 5?', options: ['2', '4', '5', '6'], answer: '4' },
        { id: 205, question: 'What is the square of 5?', options: ['10', '20', '25', '30'], answer: '25' },
        { id: 206, question: 'What is the greatest common divisor of 12 and 16?', options: ['2', '4', '6', '8'], answer: '4' },
        { id: 207, question: 'What is 15% of 300?', options: ['30', '40', '45', '50'], answer: '45' },
        { id: 208, question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: '6' },
        { id: 209, question: 'What is the value of π (Pi) approximately?', options: ['3.14', '3.12', '3.16', '3.18'], answer: '3.14' },
        { id: 210, question: 'What is the perimeter of a square with a side length of 4?', options: ['16', '12', '8', '20'], answer: '16' }
      ],
      3: [
        { id: 301, question: 'What is the speed of light?', options: ['299,792 km/s', '150,000 km/s', '300,000 km/s', '200,000 km/s'], answer: '299,792 km/s' },
        { id: 302, question: 'Who discovered gravity?', options: ['Newton', 'Einstein', 'Galileo', 'Tesla'], answer: 'Newton' },
        { id: 303, question: 'What is the unit of force in the SI system?', options: ['Joule', 'Newton', 'Pascal', 'Watt'], answer: 'Newton' },
        { id: 304, question: 'What is the acceleration due to gravity on Earth?', options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '9.5 m/s²'], answer: '9.8 m/s²' },
        { id: 305, question: 'What is the principle of conservation of energy?', options: ['Energy cannot be created or destroyed', 'Energy can be created from nothing', 'Energy always increases', 'Energy can be lost'], answer: 'Energy cannot be created or destroyed' },
        { id: 306, question: 'Which of the following is a scalar quantity?', options: ['Force', 'Velocity', 'Mass', 'Acceleration'], answer: 'Mass' },
        { id: 307, question: 'What is the formula for calculating kinetic energy?', options: ['KE = 1/2 mv²', 'KE = mv', 'KE = mgh', 'KE = 2mv'], answer: 'KE = 1/2 mv²' },
        { id: 308, question: 'What is the phenomenon of bending of light called?', options: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'], answer: 'Refraction' },
        { id: 309, question: 'What is the relationship between voltage, current, and resistance called?', options: ['Ohm’s Law', 'Newton’s Law', 'Faraday’s Law', 'Kirchhoff’s Law'], answer: 'Ohm’s Law' },
        { id: 310, question: 'What is the measure of the average kinetic energy of particles in a substance?', options: ['Temperature', 'Heat', 'Pressure', 'Energy'], answer: 'Temperature' }
      ],
      4: [
        { id: 401, question: 'Who was the first President of the USA?', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], answer: 'George Washington' },
        { id: 402, question: 'What year did World War II end?', options: ['1945', '1939', '1918', '1941'], answer: '1945' }
      ]
    };
    return questions[quizId];
  }
}
