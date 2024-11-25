import {Component, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {Quiz} from "../../models/quiz.model";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";

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

  constructor(private quizService: QuizService,
              private router: Router,
              private authService: AuthService,) {}

  ngOnInit(): void {
    this.quizzes = this.quizService.getQuizzes();
    this.uniqueSubjects = Array.from(new Set(this.quizzes.map((quiz: { subject: any; }) => quiz.subject)));
    this.filteredQuizzes = this.quizzes;
  }

  filterQuizzes(): void {
    this.filteredQuizzes = this.selectedSubject
      ? this.quizzes.filter((quiz: { subject: string; }) => quiz.subject === this.selectedSubject)
      : this.quizzes;
  }

  startQuiz(id: number): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([`/quiz`, id]);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

}
