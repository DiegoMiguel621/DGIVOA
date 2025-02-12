import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-empleado-modal',
  templateUrl: './eliminar-empleado-modal.component.html',
  styleUrl: './eliminar-empleado-modal.component.css'
})
export class EliminarEmpleadoModalComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminarEmpleadoModalComponent>
  ) {
    console.log("El modal se ha abierto");
  }


  onSubmit() {
  }


  cerrarModal(): void {
    this.dialogRef.close();
  }


}
