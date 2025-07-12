import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

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
  registerForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    mobile: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() {}

  onSubmit(event: any) {
    console.log('Form submitted:', event);
    event.preventDefault();
  }
}
