import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BandService } from '../../shared/band/band.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule, HeaderComponent],
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit {
  requestForm: FormGroup;
  submitted = false;
  error_message = '';
  private band_id = '';

  constructor(
    private formBuilder: FormBuilder,
    private bandService: BandService,
    private router: Router,
    private userService : UserService
  ) {

   this.band_id = this.userService.getBandId();
   if(this.band_id == ""){
    this.router.navigateByUrl("/");
  }
    this.requestForm = this.formBuilder.group({
      title : ['', [Validators.required, Validators.maxLength(50)]],
      new_member_instrument: ['', [Validators.required, Validators.maxLength(30)]],
      instrument_level: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(1000)]],
      band_id: [this.band_id, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    if (this.requestForm.valid) {
      this.bandService.addRequest(this.requestForm.value).subscribe({
        next: (data) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.error_message = 'Validation failed';
          } else {
            this.error_message = 'Server error';
          }
        }
      });
    }
  }


  getBandId(): string {
    
    return this.band_id;
  }
}
