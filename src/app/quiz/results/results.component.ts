import {Component, Input, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

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
  quizId: number = 1; // Default to 1 or another appropriate fallback
  score: number = 0;
  totalQuestions: number = 0;

  constructor(private quizService: QuizService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { selectedAnswers: any; quizId: number } | undefined;
    this.selectedAnswers = state?.selectedAnswers || {}; // Use empty object if undefined
    this.quizId = state?.quizId ?? 1; // Default quizId to 1 if undefined
  }

  ngOnInit() {
    const result = this.quizService.calculateScore(this.selectedAnswers, this.quizId);
    this.score = result.score;
    this.totalQuestions = result.total;
  }
}
