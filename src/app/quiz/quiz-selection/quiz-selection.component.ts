import {Component, OnInit} from '@angular/core';
import {Quiz} from "../../models/quiz.model";
import {QuizService} from "../../services/quiz.service";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-quiz-selection',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './quiz-selection.component.html',
  styleUrl: './quiz-selection.component.css'
})
export class QuizSelectionComponent implements OnInit {
  selectedSubject: string = '';
  public quizzes: any;

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.quizzes = this.quizService.getQuizzes();
  }

  onSelectSubject(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSubject = target.value;
  }

  startQuiz(quizId: number): void {
// Navigate to the quiz with the specified ID
    this.router.navigate([`/quiz`, quizId]);  // Pass quizId as a parameter
  }
}
