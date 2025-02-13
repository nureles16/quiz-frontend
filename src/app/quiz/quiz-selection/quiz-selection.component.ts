import {Component, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {Quiz} from "../../models/quiz.model";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {take} from "rxjs";

@Component({
  selector: 'app-quiz-selection',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './quiz-selection.component.html',
  styleUrl: './quiz-selection.component.css'
})
export class QuizSelectionComponent implements OnInit {
  selectedSubject: string = '';
  public quizzes: any;
  uniqueSubjects: string[] = [];
  filteredQuizzes: Quiz[] = [];
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(private quizService: QuizService,
              private router: Router,
              private authService: AuthService,) {}

  ngOnInit(): void {
    this.quizService.getQuizzes().subscribe(
      (quizzes) => {
        this.quizzes = quizzes;
        this.uniqueSubjects = Array.from(new Set(quizzes.map(quiz => quiz.subject)));
        this.filteredQuizzes = quizzes;
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
      }
    );
  }

  filterQuizzes(): void {
    this.filteredQuizzes = this.selectedSubject
      ? this.quizzes.filter((quiz: { subject: string; }) => quiz.subject === this.selectedSubject)
      : this.quizzes;
  }

  startQuiz(id: number): void {
    this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      this.router.navigate([isLoggedIn ? `/quiz/${id}` : '/login']);
    });
  }
}
