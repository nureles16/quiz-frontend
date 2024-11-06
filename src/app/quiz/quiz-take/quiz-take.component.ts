import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './quiz-take.component.html',
  styleUrl: './quiz-take.component.css'
})
export class QuizTakeComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswers: { [questionId: number]: string } = {};
  timer: any; // To hold setInterval reference
  timeLeft: number = 50; // Set your quiz duration in seconds (e.g., 5 minutes = 300 seconds)
  userId: number = 1;

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    const quizId = 1; // Replace with the actual quiz ID
    this.questions = this.quizService.getQuestions(quizId);

    // Start the countdown timer
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timer); // Clear the timer when component is destroyed
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitQuiz(); // Submit quiz when time is up
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  selectAnswer(questionId: number, answer: string) {
    this.selectedAnswers[questionId] = answer;
  }

  goToNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToPreviousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    clearInterval(this.timer); // Stop the timer when the quiz is submitted
    const score = this.calculateScore();
    const quizResult = {
      quizId: 1,
      score: score,
      totalQuestions: this.questions.length,
      selectedAnswers: this.selectedAnswers
    };

    // Submit quiz result to the backend
    this.quizService.submitQuizResult(this.userId, quizResult).subscribe(
      (response) => {
        console.log('Quiz result saved successfully:', response);
        this.router.navigate(['/results'], {
          state: { selectedAnswers: this.selectedAnswers, quizId: 1 }
        });
      },
      (error) => {
        console.error('Error submitting quiz result:', error);
      }
    );
  }

  calculateScore(): number {
    let score = 0;
    // Loop through each question to calculate the score
    this.questions.forEach((question) => {
      if (this.selectedAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  }

  resetCurrentQuestion() {
    const currentQuestionId = this.questions[this.currentQuestionIndex].id;
    delete this.selectedAnswers[currentQuestionId];
  }

  cancelQuiz() {
    this.selectedAnswers = {}; // Clear selected answers
    this.router.navigate(['/quiz-selection']); // Navigate back to quiz selection page
  }
}
