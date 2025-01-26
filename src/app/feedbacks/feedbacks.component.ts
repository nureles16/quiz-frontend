import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FeedbackService} from "../services/feedback.service";


@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    KeyValuePipe
  ],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css'
})
export class FeedbackComponent implements OnInit {
  quizId!: number;
  quizTitle: string = '';
  subject: string = '';
  userAnswers: { [key: string]: string } = {};
  correctAnswers: { [key: string]: string } = {};
  score: number = 0;
  totalQuestions: number = 0;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));

    this.feedbackService.getFeedbackByQuizId(this.quizId).subscribe({
      next: (data) => {
        console.log('Received feedback:', data);

        const feedback = Array.isArray(data) ? data[0] : data;

        this.quizTitle = feedback?.title ?? 'Unknown Quiz';
        this.subject = feedback?.subject ?? 'Unknown Subject';
        this.userAnswers = feedback?.userAnswers ?? {};
        this.correctAnswers = feedback?.correctAnswers ?? {};
        this.score = feedback?.score ?? 0;
        this.totalQuestions = feedback?.totalQuestions ?? 1;

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
        this.loading = false;
      }
    });
  }


  goBack() {
    this.router.navigate(['/profile']);
  }
  protected readonly Object = Object;
}
