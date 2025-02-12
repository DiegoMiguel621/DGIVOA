import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-eliminar-empleado-modal',
  templateUrl: './eliminar-empleado-modal.component.html',
  styleUrls: ['./eliminar-empleado-modal.component.css']
})
export class EliminarEmpleadoModalComponent {
  idEmpleado: number;

  constructor(
    public dialogRef: MatDialogRef<EliminarEmpleadoModalComponent>,
    private empleadosService: EmpleadosService,
    @Inject(MAT_DIALOG_DATA) public data: { id_empleado: number } // Recibe el ID del empleado a eliminar
  ) {
    this.idEmpleado = data.id_empleado;
    console.log(`ID del empleado a eliminar: ${this.data.id_empleado}`);
  }

  eliminarEmpleado(): void {
    if (this.idEmpleado) {
      this.empleadosService.darDeBajaEmpleado(this.idEmpleado).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al dar de baja al empleado:', error);
        }
      );
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
