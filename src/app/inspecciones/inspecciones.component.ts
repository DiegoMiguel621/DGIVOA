import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-inspecciones',
  templateUrl: './inspecciones.component.html',
  styleUrl: './inspecciones.component.css'
})
export class InspeccionesComponent {
  isAsideCollapsed = false;
  busqueda: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }
}
