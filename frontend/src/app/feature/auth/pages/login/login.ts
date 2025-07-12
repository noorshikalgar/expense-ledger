import { CommonModule } from '@angular/common';
import { Component, inject, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ApiWrapper } from '../../../../core/services/api.wrapper';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    identifier: new FormControl(''),
    password: new FormControl(''),
  });
  authService = inject(AuthService);
  constructor(
    private router: Router,
    private apiWrapper: ApiWrapper,
    private userService: UserService
  ) {}

  ngOnInit() {
    console.log('Login component initialized');
    // Check if user is already logged in
    if (this.userService.isUserLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(event: any) {
    console.log('Form submitted:', this.loginForm.value);
    event.preventDefault();
    this.apiWrapper.post('/auth/login', this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.authService.setAuthTokens(response.data);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  goToRegister() {
    console.log('Navigating to register page');
    this.router.navigate(['/register']);
  }
}
