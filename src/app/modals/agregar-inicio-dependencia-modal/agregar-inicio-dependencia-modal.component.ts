import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService } from '../../services/inicios-obra.service';

@Component({
  selector: 'app-agregar-inicio-dependencia-modal',
  templateUrl: './agregar-inicio-dependencia-modal.component.html',
  styleUrl: './agregar-inicio-dependencia-modal.component.css'
})
export class AgregarInicioDependenciaModalComponent {
  constructor(      
      private dialogRef: MatDialogRef<AgregarInicioDependenciaModalComponent>
    ) {}

    cerrarModal(): void {
      this.dialogRef.close();
    }

}
