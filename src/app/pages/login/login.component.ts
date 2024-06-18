import { Component, WritableSignal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { UserService } from '../../shared/user/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../sharedComponents/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    HttpClientModule ,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = signal(false);
  error_message = signal(''); 



  constructor(private formBuilder: FormBuilder, private userService: UserService,private  router : Router) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    this.error_message.set('');
    this.submitted.set(true);
    if (this.loginForm.valid) {


      this.userService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next : (data: any) => {
          this.userService.createUser(data.user);
          this.router.navigate(['/']);;
        },

        error : (data: any) => {     
          if (data.status === 401) {
            this.error_message.update(() => 'Usuario o contraseña incorrectos')
          }else{
            this.error_message.update(() => 'Error en el servidor, inténtelo de nuevo más tarde')
          }
        }

        });
    }
  }
}
