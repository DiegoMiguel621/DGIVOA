import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  isAsideCollapsed = false;
  empleados: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    // Verificar si estamos en el navegador antes de usar localStorage
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

    // Cargar empleados al iniciar
    this.cargarEmpleados();
  }

  /**
   * Método que se ejecuta cuando el aside cambia de estado
   */
  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;

    // Guardamos el estado en localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('asideCollapsed', collapsed.toString());
    }
  }

  /**
   * Método para cargar los empleados desde la API
   */
  cargarEmpleados(): void {
    this.empleadosService.getEmpleados().subscribe(
      (data) => {
        this.empleados = data;
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }
}
