import {Component, OnInit} from '@angular/core';
import {QuizService} from "../services/quiz.service";
import {Router} from "@angular/router";
import {DatePipe, NgForOf} from "@angular/common";
import {AuthService, User} from "../auth/auth.service";

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

  constructor(private authService: AuthService,
              private quizService: QuizService,
              private router: Router,
              private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
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
    this.authService.logout();
    this.router.navigate(['/quiz-selection']);
  }

  deleteQuizResult(resultId: number): void {
    if (confirm('Are you sure you want to delete this quiz result?')) {
      this.quizService.deleteQuizResult(resultId).subscribe({
        next: () => {
          console.log('Quiz result deleted successfully.');
          this.quizHistory = this.quizHistory.filter((result) => result.id !== resultId);
          this.totalQuizzes--;
        },
        error: (error) => {
          console.error('Error deleting quiz result:', error);
        }
      });
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm') || '';
  }
}
