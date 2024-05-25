import { Component } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent {
  
  user : any;

  constructor(private userService : UserService,private router : Router){
    this.user = this.userService.getUser();

    if(!this.userService.isLoggedIn()){
      this.router.navigateByUrl("/");
    }
    console.log(this.user);
  }

  ngOnchanges(){
    if(!this.userService.isLoggedIn()){
      this.router.navigateByUrl("/");
    }
  }
}
