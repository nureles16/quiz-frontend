import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../auth.service";
import {Router, RouterLink} from '@angular/router';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf,
    MatButton,
    MatError,
    MatLabel,
    MatFormField,
    MatInput,
    MatCardContent,
    MatCardTitle,
    MatCard,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  registrationError: string | null = null;
  loading = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    this.loading = true;

    const user = this.registerForm.value;

    this.authService.register(user).subscribe({
      next: () => {
        console.log('Registration successful');
        this.loading = false;
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.registrationError = err.message; // Display error on screen
        this.loading = false;
      }
    });
  }

}
