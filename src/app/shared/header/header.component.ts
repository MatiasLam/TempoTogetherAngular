import { Component, signal } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  logged = signal(false);

  constructor(private userService : UserService,private router : Router){

    console.log("ususario log ? " +this.userService.isLoggedIn())
    if(this.userService.isLoggedIn()){
      this.logged.update(() => true);
      console.log("logged" + this.logged)
    }

  }

  cerrarSesion(){
    this.userService.logout();
    this.logged.update(() => false);
    this.router.navigate(['/']);
  }

}
