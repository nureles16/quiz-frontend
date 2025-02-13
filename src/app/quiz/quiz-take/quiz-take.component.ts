import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {interval, Subscription, takeWhile} from "rxjs";
import {AuthService, User} from "../../auth/auth.service";

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
  timeLeft: number = 100;
  user: User | null = null;
  timerSubscription: Subscription | undefined;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.quizService.getQuestions(id).subscribe(
        (questions) => {
          this.questions = questions;
          this.startTimer();
        },
        (error) => {
          console.error('Error fetching questions:', error);
        }
      );
    });
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  startTimer() {
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timeLeft > 0)
    ).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        this.submitQuiz();
      }
    });
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
    this.timerSubscription?.unsubscribe();

    if (Object.keys(this.selectedAnswers).length < this.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    if (!this.user) {
      alert('User is not logged in.');
      this.router.navigate(['/login']);
      return;
    }

    const id = +this.route.snapshot.paramMap.get('id')!;

    this.quizService.calculateScore(this.selectedAnswers, id).subscribe(
      ({ score, total }) => {

        const userAnswersMap = this.questions.reduce((map, question) => {
          map[String(question.id)] = this.selectedAnswers[question.id] || '';
          return map;
        }, {} as { [key: string]: string });

        const correctAnswersMap = this.questions.reduce((map, question) => {
          map[String(question.id)] = question.answer || '';
          return map;
        }, {} as { [key: string]: string });

        const quizResult = {
          id: id,
          userId: this.user?.id,
          username: this.user?.username,
          title: this.questions[0]?.title || 'Unknown Title',
          subject: this.questions[0]?.subject || 'Unknown Subject',
          score: score,
          totalQuestions: total,
          userAnswers: { ...userAnswersMap },
          correctAnswers: { ...correctAnswersMap },
        };

        sessionStorage.setItem('quizResult', JSON.stringify(quizResult));

        this.quizService.submitQuizResult(quizResult).subscribe(
          response => {
            console.log('Quiz result saved successfully:', response);
            this.router.navigate(['/results'], {
              queryParams: { quizId: id },
              state: { selectedAnswers: userAnswersMap }
            });
          },
          error => {
            console.error('Error saving quiz result:', error);
            if (error.status === 401) {
              alert('Your session has expired. Please log in again.');
              this.router.navigate(['/login']);
            }
          }
        );
      },
      error => {
        console.error('Error calculating score:', error);
      }
    );
  }


  resetCurrentQuestion() {
    const currentQuestionId = this.questions[this.currentQuestionIndex].id;
    delete this.selectedAnswers[currentQuestionId];
  }

  cancelQuiz() {
    this.selectedAnswers = {};
    this.router.navigate(['/quiz-selection']);
  }
}
