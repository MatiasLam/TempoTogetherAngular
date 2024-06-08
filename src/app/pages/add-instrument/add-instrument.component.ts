import { Component, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentService } from '../../shared/intruments/instrument.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/user/user.service';

@Component({
  selector: 'app-add-instrument',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterLink],
  templateUrl: './add-instrument.component.html',
  styleUrls: ['./add-instrument.component.css']
})
export class AddInstrumentComponent implements AfterViewInit {

  user_id : number = -1;

  instruments: any[] = [];
  selectedInstrument: string = '';
  levels: any = {};
  errorMessage: string = '';

  instrumentosMostrar: any[] = [];

  instrumentosUser: any[] = [];
  finished = false; 

  constructor(private instrumentService: InstrumentService , private userService : UserService) {}

  ngAfterViewInit() {
    this.user_id = this.userService.getUserId();

    console.log("user_id", this.user_id);

    // if(this.userService.getUserId() == -1){
    //   this.userService.logout();
    // }
    console
    this.instrumentService.getInstruments().subscribe({
      next: (data: any) => {
        this.instruments = data;
        console.log(data);
        this.instrumentosMostrar = data.slice(0, 4);
  
        // Inicializar los niveles de los instrumentos a 0
        this.instrumentosMostrar.forEach((instrument: any) => {
          this.levels[instrument.instrument_id] = 0;
        });
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });


    console.log("user_id", this.user_id);
     this.instrumentService.getInstrumentsUser(this.user_id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.instrumentosUser = data;

        if(this.instrumentosUser.length > 0){
          this.instrumentosMostrar = this.instrumentosUser;
          this.instrumentosMostrar.forEach((instrument: any) => {
            this.levels[instrument.instrument_id] = instrument.instrument_level;
          });
        }

      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });


  }
  

  onSubmit() {
    const instrumentData = {
      user_id: this.user_id, // Reemplaza con el ID del usuario actual
      instruments: this.instrumentosMostrar.map(instrument => ({
        instrument_id: instrument.instrument_id,
        instrument_level: this.levels[instrument.instrument_id]
      }))
    };

    // Filtrar los instrumentos que tengan nivel 0
    instrumentData.instruments = instrumentData.instruments.filter(instrument => instrument.instrument_level > 0);
  

    if (instrumentData.instruments.length === 0) {
      this.errorMessage = 'Please select at least one instrument.';
      return;
    }
    this.instrumentService.addInstruments(instrumentData).subscribe({
      next: (response: any) => {
        console.log('Instruments added successfully', response);
        this.errorMessage = ''; 
        this.finished = true;
      },
      error: (error: any) => {
        console.error('Error adding instruments', error);
        this.errorMessage = 'There was an error adding the instruments.';
      }
    });
  }

  trackById(index: number, instrument: any): number {
    return instrument.instrument_id;
  }

  agregarInstrumento(instrument_id: any) {
    const instrumento = this.instruments.find((instrument: any) => instrument.instrument_id == instrument_id);

    if (instrumento && !this.instrumentosMostrar.includes(instrumento)) {
      this.instrumentosMostrar.push(instrumento);
      this.levels[instrument_id] = 0;
    }
    console.log(this.instrumentosMostrar);
  }

}
