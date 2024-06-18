import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { BandService } from '../../shared/band/band.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';

@Component({
  selector: 'app-add-concert',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './add-concert.component.html',
  styleUrls: ['./add-concert.component.css']
})
export class AddConcertComponent implements  AfterViewInit {
  concertForm: FormGroup;
  submitted = false;
  error_message = '';
  map: any;
  marker: any;
  bandId: number;
  posterFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private bandservice: BandService,
    private router: Router,
    private user: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.concertForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(70)]],
      date: ['', Validators.required],
      time: ['', [Validators.required, Validators.maxLength(10)]],
      place: ['', [Validators.required, Validators.maxLength(100)]],
      desc: ['', [Validators.maxLength(1000)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      poster: [null]
    });

    // Recibir bandId del estado de la navegación
    this.bandId = this.user.getBandId();
  
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    var greenIcon = L.icon({
      iconUrl: 'assets/icons/pin-map.png',
      iconSize: [55, 55],
      shadowSize: [50, 64],
      iconAnchor: [22, 55],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76]
    });

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.map = L.map('map').setView([37.38901, -5.98446], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
        this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
        this.concertForm.patchValue({
          latitude: lat,
          longitude: lng
        });
      });
    } else {
      console.error('Map container not found');
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.posterFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.concertForm.valid) {
      const formData = new FormData();
      formData.append('title', this.concertForm.get('title')?.value);
      formData.append('date', this.concertForm.get('date')?.value);
      formData.append('time', this.concertForm.get('time')?.value);
      formData.append('place', this.concertForm.get('place')?.value);
      formData.append('desc', this.concertForm.get('desc')?.value);
      formData.append('latitude', this.concertForm.get('latitude')?.value);
      formData.append('longitude', this.concertForm.get('longitude')?.value);
      formData.append('band_id', this.bandId.toString());

      if (this.posterFile) {
        formData.append('poster', this.posterFile);
      }

      this.bandservice.addConcert(formData).subscribe({
        next: (data: any) => {
          this.router.navigate(['/']);
        },
        error: (data: any) => {
          console.error('Error añadiendo concierto:', data);
          this.error_message = 'Error añadiendo concierto';
        }
      });
    }
  }
}
