import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterBandComponent } from './pages/register-band/register-band.component';
import { AddBandMemberComponent } from './pages/add-band-member/add-band-member.component';
import { HomeUserComponent } from './pages/home-user/home-user.component';
import { AddRequestComponent } from './pages/add-request/add-request.component';
import { AddConcertComponent } from './pages/add-concert/add-concert.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrate', component: RegisterComponent},
    { path: 'registro-banda', component: RegisterBandComponent},
    { path : 'nuevo-miembro', component: AddBandMemberComponent},
    { path : 'home-usuario' , component: HomeUserComponent},
    { path : "nueva-request", component: AddRequestComponent},
    { path : "nuevo-concierto", component: AddConcertComponent},
    { path: '', component: HomeComponent},

];
