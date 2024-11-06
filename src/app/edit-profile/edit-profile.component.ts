import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})

export class EditProfileComponent implements OnInit {
  user: any; // Replace with your user model
  originalUser: any; // To hold a copy of the original user data

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser(); // Fetch current user data
    this.originalUser = { ...this.user }; // Create a copy of the user data
  }

  onSubmit(): void {
    this.userService.updateUser(this.user); // Update user details in the service
    this.router.navigate(['/profile']); // Redirect to the profile page
  }

  cancel(): void {
    // Reset the user data to the original before navigating away
    this.user = { ...this.originalUser }; // Ensure to reset to the original data
    this.router.navigate(['/profile']); // Redirect to the profile page
  }
}
