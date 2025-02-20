import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EmpleadosService } from '../../services/empleados.service';
import { MatDialog } from '@angular/material/dialog';

import { AgregarEmpleadosModalComponent } from '../../modals/agregar-empleados-modal/agregar-empleados-modal.component';
import { EditarEmpleadosModalComponent } from '../../modals/editar-empleados-modal/editar-empleados-modal.component';
import { EliminarEmpleadoModalComponent } from '../../modals/eliminar-empleado-modal/eliminar-empleado-modal.component';
import { RestaurarEmpleadoModalComponent } from '../../modals/restaurar-empleado-modal/restaurar-empleado-modal.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  isAsideCollapsed = false;
  empleados: any[] = [];
  mostrandoInactivos = false; // 🔄 Controla qué lista se muestra

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private empleadosService: EmpleadosService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {  
    this.obtenerEmpleados(); 

    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }    
    this.cargarEmpleados();
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('asideCollapsed', collapsed.toString());
    }
  }

  cargarEmpleados(): void {
    this.empleadosService.getEmpleados(this.mostrandoInactivos).subscribe(
      (data) => {
        this.empleados = data;
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }

  obtenerEmpleados(): void {
    this.empleadosService.getEmpleados(this.mostrandoInactivos).subscribe(
      (data) => {
        this.empleados = data;
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }
  

  // 🔄 Alternar entre empleados activos e inactivos
  alternarEmpleados(): void {
    this.mostrandoInactivos = !this.mostrandoInactivos;
    this.obtenerEmpleados(); // 🔄 Actualiza la tabla según el estado
  }
  

  agregarEmpleado(): void {
    console.log("Intentando abrir el modal...");
    if (isPlatformBrowser(this.platformId)) {
      const dialogRef = this.matDialog.open(AgregarEmpleadosModalComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) { 
          this.cargarEmpleados();
        } 
        console.log("El modal se cerró");
      });
    }
  }

  editarEmpleado(id_empleado: number): void {
    this.empleadosService.obtenerEmpleadoPorId(id_empleado).subscribe(empleado => {
      const dialogRef = this.matDialog.open(EditarEmpleadosModalComponent, {
        width: '400px',
        data: empleado
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.obtenerEmpleados();
        }
      });
    });
  }

  eliminarEmpleado(id_empleado: number): void {
    const dialogRef = this.matDialog.open(EliminarEmpleadoModalComponent, {
      data: { id_empleado }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarEmpleados();
      }
    });
  }

  // 🆕 Nueva función para restaurar empleados
  restaurarEmpleado(id_empleado: number): void {
    const dialogRef = this.matDialog.open(RestaurarEmpleadoModalComponent, {
      data: { id_empleado }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarEmpleados();
      }
    });
  }
}
