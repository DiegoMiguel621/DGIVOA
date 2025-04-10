import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VisitasService, Visita } from '../../services/visitas.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrl: './visitas.component.css'
})
export class VisitasComponent implements OnInit {
  isAsideCollapsed = false;
  visitas: Visita[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private visitasService: VisitasService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

    this.cargarVisitas();
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }

  cargarVisitas(): void {
    this.visitasService.obtenerVisitas().subscribe({
      next: (data) => this.visitas = data,
      error: (err) => console.error('Error al obtener visitas:', err)
    });
  }
}
