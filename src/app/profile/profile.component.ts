import {Component, OnInit} from '@angular/core';
import {QuizService} from "../services/quiz.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {DatePipe, NgForOf} from "@angular/common";
import {User} from "../auth/auth.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  user: any;
  quizHistory: any[] = [];
  totalQuizzes: number = 0;

  constructor(private userService: UserService, private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.quizHistory = this.quizService.getUserQuizHistory(this.user.id);
    this.totalQuizzes = this.quizHistory.length;
  }

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/quiz-selection']);
  }

  deleteQuiz(index: number): void {
    this.quizHistory.splice(index, 1);
    this.totalQuizzes = this.quizHistory.length;
  }
}
