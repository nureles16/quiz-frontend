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
  user: any;
  originalUser: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.originalUser = { ...this.user };
  }

  onSubmit(): void {
    this.userService.updateUser(this.user);
    this.router.navigate(['/profile'])
  }

  cancel(): void {
    this.user = { ...this.originalUser };
    this.router.navigate(['/profile']);
  }
}
