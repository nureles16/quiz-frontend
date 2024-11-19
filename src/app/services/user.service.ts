import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  updateUser(user: User): void {
    this.userSubject.next(user);
  }

  logout(): void {
    this.userSubject.next(null);
  }
}
