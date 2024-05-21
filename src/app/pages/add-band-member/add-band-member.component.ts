import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-band-member',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-band-member.component.html',
  styleUrls: ['./add-band-member.component.css']
})
export class AddBandMemberComponent {
  @Output() memberAdded = new EventEmitter<any>();
  addMemberForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.addMemberForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // Otros campos para el miembro de la banda, si es necesario
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addMemberForm.valid) {
      this.memberAdded.emit(this.addMemberForm.value);
      this.addMemberForm.reset();
      this.submitted = false;
    }
  }
}
