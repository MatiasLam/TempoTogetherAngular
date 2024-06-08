import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../shared/user/user.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../sharedComponents/header/header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  registerForm: FormGroup;
  submitted = false;
  error_message = '';
  map: any;
  marker: any;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/home-user');
    }
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(12)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required, Validators.max(99)]],
      telephone: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      type: ['', Validators.required],
      icon: [null]
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.map = L.map('map').setView([ 39.8581, -4.02263], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
        this.marker = L.marker([lat, lng]).addTo(this.map);
        this.registerForm.patchValue({
          latitude: lat,
          longitude: lng
        });
        console.log('Latitude:', lat, 'Longitude:', lng);
      });
    } else {
      console.error('Map container not found');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.registerForm.patchValue({
        icon: file
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.registerForm.patchValue({
      type: 'musician'
    });
  
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.registerForm.controls).forEach(key => {
        const controlValue = this.registerForm.get(key)?.value;
        if (key === 'icon' && this.selectedFile) {
          formData.append(key, this.selectedFile);
        } else {
          formData.append(key, controlValue);
        }
      });
  
      // Si el icono es null, eliminarlo del formData
      if (this.registerForm.get('icon')?.value === null) {
        formData.delete('icon');
      }
  
      this.userService.register(formData).subscribe({
        next: (data) => {
          this.userService.createUser(data.user);
          this.router.navigateByUrl('/instrumentos');
        },
        error: (data) => {
          if (data.status === 422) {
            const validationErrors = data.error.errors;
            const errorMessages = Object.values(validationErrors).flatMap((errors: any) => errors);
  
            const errorMessage = errorMessages.join('\n');
            this.error_message = errorMessage;
            document.getElementById('username')?.focus();
          } else {
            this.error_message = 'Server error';
            document.getElementById('username')?.focus();
          }
        }
      });
    }
  }
}