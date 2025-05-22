import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-fecha-inspeccion',
  templateUrl: './modal-fecha-inspeccion.component.html',
  styleUrls: ['./modal-fecha-inspeccion.component.css']
})
export class ModalFechaInspeccionComponent {
  fechaSeleccionada: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalFechaInspeccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fechaSeleccionada = data.fechaInspeccion || '';
  }

  aceptar(): void {
    this.dialogRef.close(this.fechaSeleccionada);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }


}
