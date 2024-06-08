import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user/user.service';
import { SearchService } from '../../shared/search/search.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetailsUserBandComponent {

  username: string = "";
  isBand: boolean = false;
  respuesta : any = [];
  band_id: number = -1;

  constructor(private router: Router, private http: HttpClient, private userService: UserService, private searchService: SearchService) { 
    // Se recibe el username que se ha enviado a través de un state en el history

    if(history.state.username){
      this.username = history.state.username;
    }
    else if(history.state.band_id){
      this.band_id = history.state.band_id;
      this.isBand = true;
    }

    this.getDetails();
  }

  getDetails() {
    if (this.band_id !== -1 && this.isBand) {
      console.log("Band ID: ", this.band_id);
      this.searchService.getBandDetails(this.band_id).subscribe({
        next: (response) => {
          this.respuesta = response.band;
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }else{
      this.searchService.getUserDetails(this.username).subscribe({
        next: (response) => {
          console.log(response);
          this.respuesta = response.user;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }

    }
  }

