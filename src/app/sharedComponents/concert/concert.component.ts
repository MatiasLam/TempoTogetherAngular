import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-concert',
  standalone: true,
  imports: [],
  templateUrl: './concert.component.html',
  styleUrl: './concert.component.css'
})
export class ConcertComponent implements OnInit{

  @Input() concert : any;

  constructor(){
  }

  ngOnInit(): void {
this.concert.poster = "http://localhost:8000"+ this.concert.poster;
  }

}
