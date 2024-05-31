import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api'; // URL de tu API

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private saveUserToLocalStorage(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadUserFromLocalStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  private clearUserFromLocalStorage() {
    localStorage.removeItem('user');
  }

  createUser(user: any) {
    this.saveUserToLocalStorage(user);
  }

  getUser() {
    return this.loadUserFromLocalStorage();
  }

  getUserId(){
    let userId = this.loadUserFromLocalStorage();
     userId = userId.user.id;
    return userId;

  }

  isLoggedIn() {
    return this.loadUserFromLocalStorage() != null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.createUser(response.user); // Suponiendo que la respuesta contiene la información del usuario
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  registerBand(band: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-band`, band);
  }

  logout() {
    this.clearUserFromLocalStorage();
  }
}
