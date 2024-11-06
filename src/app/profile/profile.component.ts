import {Component, OnInit} from '@angular/core';
import {QuizService} from "../services/quiz.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {DatePipe, NgForOf} from "@angular/common";

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
  user: any; // Replace with your user model
  quizHistory: any[] = [];
  totalQuizzes: number = 0;

  constructor(private userService: UserService, private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser(); // Fetch current user data
    this.quizHistory = this.quizService.getUserQuizHistory(this.user.id); // Fetch quiz history
    this.totalQuizzes = this.quizHistory.length;
  }

  editProfile(): void {
    // Navigate to edit profile page
    this.router.navigate(['/edit-profile']);
  }

  logout(): void {
    this.userService.logout(); // Implement your logout logic
    this.router.navigate(['/login']); // Redirect to login page
  }
}
