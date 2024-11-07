import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private user: any;

  constructor() {
    this.user = {
      id: 1,
      name: 'Nureles',
      email: 'john.doe@example.com',
    };
  }

  getCurrentUser() {
    return { ...this.user };
  }

  updateUser(updatedUser: any) {
    this.user = { ...updatedUser };
  }

  logout() {
  }
}
