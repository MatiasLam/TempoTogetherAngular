import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api'; // URL de tu API

  private user: any = null;
  
  constructor(private http: HttpClient) {}

  createUser(user : any){
    this.user = user;
  }

  getUser(){
    return this.user;
  }

  isLoggedIn(){
    return this.user != null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });

  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  registerBand(band: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-band`, band);
  }


  
}
