import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/user/user.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements  AfterViewInit {
  registerForm: FormGroup;
  submitted = false;
  error_message = '';
  map: any;
  marker: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerForm = this.formBuilder.group({
      type: ['', Validators.required],
      username: ['', [Validators.required, Validators.maxLength(12)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required, Validators.max(99)]],
      telephone: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }



  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.map = L.map('map').setView([51.505, -0.09], 13);

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

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (data) => {
          this.userService.createUser(data.user);
          this.router.navigate(['/']);
        },
        error: (data) => {
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
