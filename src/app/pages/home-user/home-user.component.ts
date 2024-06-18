import { BandService } from './../../shared/band/band.service';
import { RequestService } from './../../shared/request/request.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { Router } from '@angular/router';
import { RequestComponent } from '../../sharedComponents/request/request.component';
import { ConcertComponent } from '../../sharedComponents/concert/concert.component';
import { isPlatformBrowser } from '@angular/common';
import { VariablesService } from '../../shared/variables/variables.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [HeaderComponent, RequestComponent, ConcertComponent],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit{
  
  user : any;
  user_id : number = 0;
  private requests : any = [];
  private concerts : any = [];
  contactoSeleccionado: any = null;
  conciertoSeleccionado: any = null;

  map: any;
  marker: any;



  constructor(private userService : UserService,private router : Router, private requestservice : RequestService, private Bandservice : BandService, private variableService : VariablesService){
  }
  ngOnInit(): void {
    this.user = this.userService.getUser();

    if(!this.userService.isLoggedIn()){
      this.router.navigateByUrl("/");
    }else{
      this.user_id =this.user.user_id;
    }


    if(this.user_id !== 0){
      this.requestservice.getRequestDistance(this.user_id).subscribe((data : any) => {
        this.requests = data;
      });

      this.Bandservice.getConcertsOrderDistance(this.user_id).subscribe({
        next: (data : any) => {
          this.concerts = data;
        }
      });
      }

      this.variableService.getRequest().subscribe(contacto => {
        this.contactoSeleccionado = contacto;
      });

      this.variableService.getConcert().subscribe((concierto: any) => {
        this.conciertoSeleccionado = concierto;
        if (concierto.latitude && concierto.longitude) {
          this.updateMap(concierto.latitude, concierto.longitude);
        }
      });
  }

  

  
  updateMap(lat: number, lng: number): void {
    if (!this.map) {
      this.map = L.map('map', {
        center: [lat, lng],
        zoom: 6
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.marker = L.marker([lat, lng]).addTo(this.map);
    } else {
      this.map.setView([lat, lng], 6);
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }


  getConcerts(): any[] {
    // Comprueba si es un array
    if (!Array.isArray(this.concerts.concerts)) {
        return [];
    }

    // Si tiene más de 4 conciertos se corta el array
    if (this.concerts.concerts.length > 4) {
        return this.concerts.concerts.slice(0, 4);
    } else {
        return this.concerts.concerts;
    }
}

  getRequest(): any[] {
    // Devuelve un máximo de 4 solicitudes
    //comprueba si es un array
    if( !Array.isArray(this.requests.requests) ){
      return [];
    }

    //Si tiene mas de 4 request se corta el array
    if(this.requests.requests && this.requests.requests.length >= 4){
      return this.requests.requests.slice(0, 4);
    }else{
      return this.requests.requests;
    }  
  }


}
