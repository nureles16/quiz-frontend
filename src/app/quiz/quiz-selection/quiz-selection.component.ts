import {Component, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {Quiz} from "../../models/quiz.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-quiz-selection',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './quiz-selection.component.html',
  styleUrl: './quiz-selection.component.css'
})
export class QuizSelectionComponent implements OnInit {
  selectedSubject: string = '';
  public quizzes: any;
  uniqueSubjects: string[] = [];
  filteredQuizzes: Quiz[] = [];

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.quizzes = this.quizService.getQuizzes();
    this.uniqueSubjects = Array.from(new Set(this.quizzes.map((quiz: { subject: any; }) => quiz.subject)));

    this.filteredQuizzes = this.quizzes;
  }

  onSelectSubject(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSubject = target.value;
  }

  filterQuizzes(): void {
    this.filteredQuizzes = this.selectedSubject
      ? this.quizzes.filter((quiz: { subject: string; }) => quiz.subject === this.selectedSubject)
      : this.quizzes;
  }

  startQuiz(quizId: number): void {
    this.router.navigate([`/quiz`, quizId]);
  }
}
