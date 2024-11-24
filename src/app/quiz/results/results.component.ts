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
  id: number = 1;
  score: number = 0;
  totalQuestions: number = 0;

  constructor(private quizService: QuizService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { selectedAnswers: any; id: number } | undefined;
    this.selectedAnswers = state?.selectedAnswers || {};
    this.id = state?.id ?? 1;
  }

  ngOnInit() {
    const result = this.quizService.calculateScore(this.selectedAnswers, this.id);
    this.score = result.score;
    this.totalQuestions = result.total;
  }
}
