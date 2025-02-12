import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-agregar-empleados-modal',
  templateUrl: './agregar-empleados-modal.component.html',
  styleUrls: ['./agregar-empleados-modal.component.css']
})
export class AgregarEmpleadosModalComponent {

  constructor(
    public dialogRef: MatDialogRef<AgregarEmpleadosModalComponent>
  ) {
    console.log("El modal se ha abierto");
  }

  onSubmit() {
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

}
