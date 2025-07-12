import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  userService = inject(UserService);
  router = inject(Router);

  registerForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    mobile: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    is_deleted: new FormControl(false),
  });

  constructor() {}

  onSubmit(event: any) {
    console.log('Form submitted:', event);
    event.preventDefault();
    this.userService
      .createNewUser(this.registerForm.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            console.log('User registered successfully:', response.data);
            this.registerForm.reset();
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
      });
  }
}
