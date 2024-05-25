import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user/user.service';
import { CommonModule } from '@angular/common';
import { AddBandMemberComponent } from '../add-band-member/add-band-member.component';
import { state } from '@angular/animations';

@Component({
  selector: 'app-register-band',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AddBandMemberComponent
  ],
  templateUrl: './register-band.component.html',
  styleUrls: ['./register-band.component.css']
})
export class RegisterBandComponent {
  registerBandForm: FormGroup;
  submitted = false;
  error_message = '';
  band_id = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerBandForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(120)]],
      location: ['', [Validators.maxLength(120)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerBandForm.valid) {
      this.userService.registerBand(this.registerBandForm.value).subscribe({
        next: (data: any) => {
          this.band_id = data.id;
          this.router.navigate(['/nuevo-miembro'], { state: { bandId: this.band_id } });
        },
          
        error: (data: any) => {
          console.log('error');
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
