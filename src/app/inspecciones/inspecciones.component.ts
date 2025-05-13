import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InspeccionesService } from '../services/inspecciones.service';

@Component({
  selector: 'app-inspecciones',
  templateUrl: './inspecciones.component.html',
  styleUrls: ['./inspecciones.component.css']
})
export class InspeccionesComponent implements OnInit {
  isAsideCollapsed = false;
  busqueda: string = '';
  obrasFiltradas: any[] = [];
  todasLasObras: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private inspeccionesService: InspeccionesService
  ) {}

  ngOnInit(): void {
    // Estado del aside
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

    // Carga de obras
    this.inspeccionesService.obtenerTodasLasObras().subscribe((data: any[]) => {
      console.log('Obras cargadas:', data); // 👈 revisa si esto imprime algo
      this.todasLasObras = data;
    });
  }


  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }

  filtrarObras(): void {
    const clave = this.busqueda.trim().toLowerCase();
    console.log('Buscando:', clave); // 👈

    if (clave.length === 0) {
      this.obrasFiltradas = [];
      return;
    }

    this.obrasFiltradas = this.todasLasObras.filter(obra =>
      obra.claveObra?.toLowerCase().includes(clave)
    );

    console.log('Coincidencias:', this.obrasFiltradas); // 👈
  }

}
