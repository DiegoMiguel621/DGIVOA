import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService } from '../../services/inicios-obra.service';

@Component({
  selector: 'app-agregar-inicio-municipio-modal',
  templateUrl: './agregar-inicio-municipio-modal.component.html',
  styleUrl: './agregar-inicio-municipio-modal.component.css'
})
export class AgregarInicioMunicipioModalComponent {
  constructor(      
    private dialogRef: MatDialogRef<AgregarInicioMunicipioModalComponent>
  ) {}

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
