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
  timer: any;
  timeLeft: number = 100;
  userId: number = 1;

  constructor(private quizService: QuizService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.questions = this.quizService.getQuestions(id);
      this.startTimer();
    });
  }


  ngOnDestroy() {
    clearInterval(this.timer);
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitQuiz();
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
    clearInterval(this.timer);

    if (Object.keys(this.selectedAnswers).length < this.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const id = this.route.snapshot.paramMap.get('id')!;
    const score = this.calculateScore();
    const quizTitle = this.questions[0]?.title || 'Unknown Title';
    const quizSubject = this.questions[0]?.subject || 'Unknown Subject';
    const quizResult = {
      id: id,
      userId: this.userId,
      title: quizTitle,
      subject: quizSubject,
      score: score,
      totalQuestions: this.questions.length,
      selectedAnswers: this.selectedAnswers,
    };
    console.log(quizResult);
    this.router.navigate(['/results'], { state: quizResult });
    this.quizService.submitQuizResult(quizResult).subscribe(
      response => {
        console.log('Quiz result saved successfully:', response);
        this.router.navigate(['/results'], { state: response });
      },
      error => {
        console.error('Error saving quiz result:', error);
        if (error.status === 401) {
          alert('Your session has expired. Please log in again.');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  calculateScore(): number {
    return this.questions.reduce((score, question) => {
      return this.selectedAnswers[question.id] === question.answer ? score + 1 : score;
    }, 0);
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
