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
  providers: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  user: User | null = null;
  quizHistory: any[] = [];
  totalQuizzes: number = 0;

  constructor(private userService: UserService,
              private quizService: QuizService,
              private router: Router,
              private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    if (this.user) {
      this.quizService.getQuizResultsByUser(this.user.id).subscribe({
        next: (data) => {
          this.quizHistory = data;
          this.totalQuizzes = data.length;
        },
        error: (error) => {
          console.error('Error fetching quiz results:', error);
        }
      });
    }
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

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm') || '';
  }
}
