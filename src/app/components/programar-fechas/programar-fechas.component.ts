import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-programar-fechas',
  templateUrl: './programar-fechas.component.html',
  styleUrl: './programar-fechas.component.css'
})
export class ProgramarFechasComponent implements OnInit {
  obrasSeleccionadas: any[] = [];
  isAsideCollapsed = false;
  inspectores: any[] = [];
  inspectorSeleccionado: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private empleadosService: EmpleadosService) {}

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

      this.obtenerInspectores();
  }

  obtenerInspectores(): void {
    this.empleadosService.getEmpleados().subscribe((empleados) => {
      this.inspectores = empleados.filter(emp => emp.puesto === 'INSPECTOR');
    });
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }
}
