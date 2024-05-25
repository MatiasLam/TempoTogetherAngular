import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { UserService } from '../../shared/user/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private userService: UserService, private router : Router) { 
    if(this.userService.isLoggedIn()){
      this.router.navigateByUrl("/home-usuario");
    }
  }
}
