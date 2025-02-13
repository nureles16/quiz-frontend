import {Component, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})

export class ResultsComponent implements OnInit {
  selectedAnswers: { [questionId: number]: string } = {};
  id: number = 0;
  score: number = 0;
  totalQuestions: number = 0;
  correctAnswers: { [questionId: number]: string } = {};

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = Number(params['quizId']) || 0;

      if (this.id === 0) {
        console.error('Invalid quiz ID');
        this.router.navigate(['/quiz-selection']);
        return;
      }

      this.quizService.getQuestions(this.id).subscribe(questions => {
        if (!questions || questions.length === 0) {
          console.error('No questions found for quiz ID:', this.id);
          this.router.navigate(['/quiz-selection']);
          return;
        }

        this.correctAnswers = questions.reduce((map, question) => {
          map[String(question.id)] = question.answer;
          return map;
        }, {} as { [key: string]: string });

        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { selectedAnswers?: { [key: string]: string } } | undefined;
        this.selectedAnswers = state?.selectedAnswers || {};

        if (Object.keys(this.selectedAnswers).length === 0) {
          const savedResult = sessionStorage.getItem('quizResult');
          if (savedResult) {
            const parsedResult = JSON.parse(savedResult);
            this.selectedAnswers = parsedResult.userAnswers || {};
          }
        }

        this.calculateScore();
      });
    });
  }

  calculateScore() {
    this.quizService.calculateScore(this.selectedAnswers, this.id).subscribe(result => {
      this.score = result.score;
      this.totalQuestions = result.total;
    });
  }
}
