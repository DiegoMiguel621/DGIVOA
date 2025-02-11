import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Restaurar la última ruta visitada
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute) {
      this.router.navigateByUrl(lastRoute);
    }

    // Guardar la ruta actual cada vez que cambia
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('lastRoute', event.urlAfterRedirects);
      }
    });
  }
}
