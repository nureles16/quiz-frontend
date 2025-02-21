import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        const role = this.authService.getUserRole();
        this.isAdmin = role === 'ADMIN';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
