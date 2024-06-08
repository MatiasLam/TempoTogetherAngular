import { Component, signal, OnInit, HostListener, InjectFlags } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  logged = signal(false);
  user: any;
  userIcon: string = "";
  searchResults: any[] = []; // Lista para almacenar los resultados de búsqueda

  constructor(private userService: UserService, private router: Router, private http: HttpClient) {
    if (this.userService.isLoggedIn()) {
      this.logged.update(() => true);
    }

    if (this.userService.getUser()) {
      this.user = this.userService.getUser();
    }
  }

  ngOnInit() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    this.searchResults = [];
  }

  handleClickOutside(event: any) {
    if (!event.target.closest('.search-container')) {
      this.searchResults = [];
    }
  }

  cerrarSesion() {
    this.userService.logout();
    this.logged.update(() => false);
    this.router.navigate(['/']);
  }

  getUserIcon() {
    this.userIcon = this.userService.getUserIcon();
    return this.userIcon;
  }

  buscar(event: any) {
    const query = event.target.value.trim();
    if (query.length > 0) {
      this.http.get(`http://localhost:8000/api/search?search=${query}`).subscribe((response: any) => {
        this.searchResults = response.results;
      });
    } else {
      this.searchResults = [];
    }
  }

  detalles(result: any) {
    if (result.band_id) {
      this.router.navigate(['/detalles'], { state: { band_id: result.band_id } });
    }
    else {
    this.router.navigate(['/detalles'], { state: { username: result.username } });
    }
  }
}
