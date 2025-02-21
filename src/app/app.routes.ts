import { Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {ResultsComponent} from "./quiz/results/results.component";
import {QuizTakeComponent} from "./quiz/quiz-take/quiz-take.component";
import {QuizSelectionComponent} from "./quiz/quiz-selection/quiz-selection.component";
import {ProfileComponent} from "./profile/profile.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {FeedbackComponent} from "./feedbacks/feedbacks.component";
import {AdminGuard} from "./guards/admin.guard";
import {AdminComponent} from "./admin/admin.component";

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'quiz-selection', component: QuizSelectionComponent },
  { path: 'quiz/:id', component: QuizTakeComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'feedbacks/:quizId', component: FeedbackComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
];
