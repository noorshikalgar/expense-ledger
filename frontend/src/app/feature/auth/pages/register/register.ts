import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
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
    MessageModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  userService = inject(UserService);
  router = inject(Router);

  message = signal<{ type: string; content: string } | null>(null);

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
    this.message.set(null);
    console.log('Form submitted:', event);
    event.preventDefault();
    this.userService.createNewUser(this.registerForm.value).subscribe({
      next: (response: any) => {
        console.log('User registered successfully:', response.data);
        this.message.set({
          type: 'success',
          content: 'Registration successful! Redirecting to login...',
        });
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // 1.5 seconds delay
      },
      error: ({ error }: any) => {
        console.error('Registration failed:', error);
        this.message.set({
          type: 'error',
          content: `Registration failed - ${
            error?.message ? error?.message : '--'
          } . Please try again.`,
        });
      },
    });
  }
}
