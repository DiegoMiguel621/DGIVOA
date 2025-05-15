import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programar-fechas',
  templateUrl: './programar-fechas.component.html',
  styleUrl: './programar-fechas.component.css'
})
export class ProgramarFechasComponent implements OnInit {
  obrasSeleccionadas: any[] = [];
  isAsideCollapsed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

    const obrasDesdeNavegacion = history.state['obrasSeleccionadas'];
    const obrasDesdeStorage = localStorage.getItem('obrasSeleccionadas');

    this.obrasSeleccionadas = obrasDesdeNavegacion
      ? obrasDesdeNavegacion
      : obrasDesdeStorage ? JSON.parse(obrasDesdeStorage) : [];
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }
}
