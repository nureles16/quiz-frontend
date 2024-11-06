import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private user: any; // Replace with your user model

  constructor() {
    // This would typically come from an API or local storage
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
    this.user = { ...updatedUser }; // Update the user with new information
    // Implement logic to save the updated user to a database or local storage if needed
  }

  logout() {
    // Your logout logic here
  }
}
