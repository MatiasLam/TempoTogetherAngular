import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VariablesService } from './shared/variables/variables.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'TempoTogether';
  contactoSeleccionado: any = null;
  conciertoSeleccionado: any = null;
  map: any;
  marker: any;

  constructor(private variableService: VariablesService) {}

  ngOnInit(): void {
    this.variableService.getRequest().subscribe(contacto => {
      this.contactoSeleccionado = contacto;
    });

    this.variableService.getConcert().subscribe((concierto: any) => {
      this.conciertoSeleccionado = concierto;
      if (concierto?.latitude && concierto?.longitude) {
        this.updateMap(concierto.latitude, concierto.longitude);
      }
    });
  }

  updateMap(lat: number, lng: number): void {
    const greenIcon = L.icon({
      iconUrl: 'assets/icons/pin-map.png',
      iconSize: [55, 55],
      shadowSize: [50, 64],
      iconAnchor: [22, 55],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76]
    });

    if (!this.map) {
      this.map = L.map('mapModal', {
        center: [lat, lng],
        zoom: 14
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
    } else {
      this.map.setView([lat, lng], 14);
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
    }
  }

  ngAfterViewInit(): void {
    (window as any).$(`#concert`).on('shown.bs.modal', () => {
      this.onModalShown();
    });
  }

  onModalShown(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
}
