import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-empleados-modal',
  templateUrl: './editar-empleados-modal.component.html',
  styleUrl: './editar-empleados-modal.component.css'
})
export class EditarEmpleadosModalComponent {

  constructor(
    public dialogRef: MatDialogRef<EditarEmpleadosModalComponent>
  ) {
    console.log("El modal se ha abierto");
  }


  onSubmit() {
  }


  cerrarModal(): void {
    this.dialogRef.close();
  }


}
