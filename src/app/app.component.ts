import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {RegisterComponent} from "./auth/register/register.component";
import {LoginComponent} from "./auth/login/login.component";
import {MatLabel} from "@angular/material/form-field";
import {QuizSelectionComponent} from "./quiz/quiz-selection/quiz-selection.component";
import {QuizTakeComponent} from "./quiz/quiz-take/quiz-take.component";
import {ResultsComponent} from "./quiz/results/results.component";
import {HomeComponent} from "./home/home.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, LoginComponent, MatLabel, QuizSelectionComponent, QuizTakeComponent, ResultsComponent, HomeComponent, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showHeader = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !['/login', '/register', '/quiz','/'].includes(event.urlAfterRedirects);

      }
    });
  }
}
