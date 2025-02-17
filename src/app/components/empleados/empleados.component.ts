import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EmpleadosService } from '../../services/empleados.service';
import { MatDialog } from '@angular/material/dialog';

import { AgregarEmpleadosModalComponent } from '../../modals/agregar-empleados-modal/agregar-empleados-modal.component';
import { EditarEmpleadosModalComponent } from '../../modals/editar-empleados-modal/editar-empleados-modal.component';
import { EliminarEmpleadoModalComponent } from '../../modals/eliminar-empleado-modal/eliminar-empleado-modal.component';

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

    // Guardamos el estado en localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('asideCollapsed', collapsed.toString());
    }
  }

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

  obtenerEmpleados(): void {
    this.empleadosService.obtenerEmpleados().subscribe(data => {
      this.empleados = data;
    });
  }

    //modales
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
        data: empleado // Se envía el empleado al modal
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { 
          this.obtenerEmpleados(); // ✅ Recargar lista de empleados después de actualizar
        }
      });
    });
  }
  

  eliminarEmpleado(id_empleado: number): void {
    console.log(`Intentando abrir el modal para el empleado con ID: ${id_empleado}`);
  
    if (!id_empleado) {
      console.error("Error: ID del empleado no definido.");
      return;
    }
  
    const dialogRef = this.matDialog.open(EliminarEmpleadoModalComponent, {
      data: { id_empleado }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarEmpleados(); // Recargar la tabla si se realizó la baja
      }
    });
  }
  
  
  



}
