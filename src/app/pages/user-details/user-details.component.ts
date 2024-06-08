import { AfterViewInit, Component } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../sharedComponents/header/header.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements AfterViewInit{

   user : any = [];
  constructor(private userService  : UserService, private router: Router) {
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
  
      //Obten el usuario actual
  this.user = this.userService.getUser();

  this.user.icon = "http://localhost:8000" + this.user.icon;
  console.log(this.user.icon);

   }
  ngAfterViewInit(): void {

 }

 
}
