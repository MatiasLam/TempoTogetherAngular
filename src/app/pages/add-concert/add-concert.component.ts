import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";
import { BandService } from '../../shared/band/band.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-concert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-concert.component.html',
  styleUrls: ['./add-concert.component.css']
})
export class AddConcertComponent implements OnInit, AfterViewInit {
  concertForm: FormGroup;
  submitted = false;
  error_message = '';
  map: any;
  marker: any;
  bandId: number;

  constructor(
    private formBuilder: FormBuilder,
    private bandservice: BandService,
    private router: Router
  ) {
    this.concertForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(70)]],
      date: ['', Validators.required],
      time: ['', [Validators.required, Validators.maxLength(10)]],
      place: ['', [Validators.required, Validators.maxLength(100)]],
      desc: ['', [Validators.maxLength(1000)]],
      poster: ['', [Validators.maxLength(255)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });

    // Recibir bandId del estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bandId: number };
    this.bandId = state.bandId;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    var greenIcon = L.icon({
      iconUrl: 'assets/img/gato.png',
      iconSize: [38, 95],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
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
        console.log('Latitude:', lat, 'Longitude:', lng);
      });
    } else {
      console.error('Map container not found');
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.concertForm.valid) {
      const concertData = {
        ...this.concertForm.value,
        band_id: this.bandId
      };

      this.bandservice.addConcert(concertData).subscribe({
        next: (data : any) => {
          console.log('Concierto añadido con éxito:', data);
          this.router.navigate(['/']);
        },
        error: (data : any) => {
          console.error('Error añadiendo concierto:', data);
          this.error_message = 'Error añadiendo concierto';
        }
      });
    }
  }
}
