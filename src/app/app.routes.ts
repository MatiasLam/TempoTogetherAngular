import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterBandComponent } from './pages/register-band/register-band.component';
import { AddBandMemberComponent } from './pages/add-band-member/add-band-member.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent},
    { path: 'registro-banda', component: RegisterBandComponent},
    { path : 'nuevo-miembro', component: AddBandMemberComponent},
    { path: '', component: HomeComponent},

];
