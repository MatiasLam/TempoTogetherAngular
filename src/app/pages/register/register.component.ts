import { Component, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../shared/user/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  error_message = '';
  step = 1;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      type: ['', Validators.required],
      username: ['', [Validators.required, Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required, Validators.max(99)]],
      telephone: ['', [Validators.minLength(9), Validators.maxLength(9)]],
    });
  }

  selectType(type: string): void {
    this.registerForm.controls['type'].setValue(type);
  }

  nextStep(): void {
    this.submitted = true;
    if (this.registerForm.controls['type'].valid) {
      this.step = 2;
      this.submitted = false;
    }
  }

  prevStep(): void {
    this.step = 1;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (data: any) => {
          if (this.registerForm.value.type === 'band') {
            this.router.navigate(['/register-band']);
          } else {
            this.router.navigate(['/']);  // Redirigir a la página de inicio o a otra página después del registro
          }
        },
        error: (data: any) => {
          if (data.status === 422) {
            this.error_message = 'Validation failed';
          } else {
            this.error_message = 'Server error';
          }
        }
      });
    }
  }
}
