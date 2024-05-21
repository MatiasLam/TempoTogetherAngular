import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { UserService } from '../../shared/user/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private userService: UserService) { 
    if(this.userService.isLoggedIn()){
      console.log("User is logged in");
    }
  }
}
