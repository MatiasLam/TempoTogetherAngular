import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/user/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-band-member',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-band-member.component.html',
  styleUrls: ['./add-band-member.component.css']
})
export class AddBandMemberComponent {
  @Output() memberAdded = new EventEmitter<any>();

  bandId : string = "";
  addMemberForm: FormGroup;
  submitted = false;
  error_message: string | null = null;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router : Router) {

      //se recibe el id de la banda desde el state
      const state = window.history.state;
      if (state && state.bandId) {
        this.bandId = state.bandId;
      } else {
        // this.router.navigate(['/registro-banda']);
      }
    this.addMemberForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      instrument: ['', [Validators.required]],
      age: ['', [Validators.required]],
      instrument_level: ['', [Validators.required]]
    });
  }

  onsubmitMember(): void {
    this.submitted = true;
    if (this.addMemberForm.valid && this.bandId) {
      const memberData = { ...this.addMemberForm.value, band_id: this.bandId };
      this.userService.registerBand({ members: [memberData] }).subscribe({
        next: (data: any) => {
          this.memberAdded.emit(data);
          this.addMemberForm.reset();
          this.submitted = false;
          this.error_message = null;
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
