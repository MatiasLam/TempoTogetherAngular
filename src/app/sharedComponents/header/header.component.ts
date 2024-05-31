import { Component, signal } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
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
  user :any;

  constructor(private userService : UserService,private router : Router){

    if(this.userService.isLoggedIn()){
      this.logged.update(() => true);
    }

    if(this.userService.getUser()){
      this.user = this.userService.getUser();
      console.log(this.user);
    }
  }

  cerrarSesion(){
    this.userService.logout();
    this.logged.update(() => false);
    this.router.navigate(['/']);
  }

}
