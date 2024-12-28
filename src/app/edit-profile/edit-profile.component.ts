import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth/auth.service";

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
  user: any;
  originalUser: any;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.originalUser = { ...this.user };
  }

  onSubmit(): void {
    this.authService.updateUser(this.user).subscribe(
      updatedUser => {
        console.log('User successfully updated:', updatedUser);
        this.router.navigate(['/profile']);
      },
      error => {
        console.error('Error updating user:', error.message);
      }
    );
  }

  cancel(): void {
    this.user = { ...this.originalUser };
    this.router.navigate(['/profile']);
  }
}
