import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados.service';
import { ModalFechaInspeccionComponent } from '../../modals/modal-fecha-inspeccion/modal-fecha-inspeccion.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private empleadosService: EmpleadosService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

  const obrasDesdeNavegacion = this.router.getCurrentNavigation()?.extras.state?.['obrasSeleccionadas'];
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


  abrirModalFecha(obra: any): void {
    const dialogRef = this.dialog.open(ModalFechaInspeccionComponent, {
      data: obra
    });

    dialogRef.afterClosed().subscribe(fecha => {
      if (fecha) {
        obra.fechaInspeccion = fecha; // guardar en objeto local
      }
    });
  }
}
