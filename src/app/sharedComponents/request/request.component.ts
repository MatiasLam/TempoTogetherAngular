import { Component, Input, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent implements OnInit{

  @Input() request : any;

  constructor(){}
  ngOnInit(): void {

  }

}
