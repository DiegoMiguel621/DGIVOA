import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-restaurar-empleado-modal',
  templateUrl: './restaurar-empleado-modal.component.html',
  styleUrl: './restaurar-empleado-modal.component.css'
})
export class RestaurarEmpleadoModalComponent {

  constructor(
    public dialogRef: MatDialogRef<RestaurarEmpleadoModalComponent>,
    private empleadosService: EmpleadosService,
    @Inject(MAT_DIALOG_DATA) public data: { id_empleado: number } // Recibe el ID del empleado a restaurar
  ) {    
    
  }

  restaurarEmpleado(): void {
    this.empleadosService.restaurarEmpleado(this.data.id_empleado).subscribe(
      response => {
        console.log('Empleado restaurado correctamente');
        this.dialogRef.close(true); // ✅ Cerramos el modal y actualizamos la tabla
      },
      error => {
        console.error('Error al restaurar empleado:', error);
        alert('Error en el servidor, intente de nuevo');
      }
    );
  }
  

  cerrarModal(): void {
    this.dialogRef.close();
  }

}
