import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-concert',
  standalone: true,
  imports: [],
  templateUrl: './concert.component.html',
  styleUrl: './concert.component.css'
})
export class ConcertComponent{

  @Input() concert : any;

  constructor(){}

}
