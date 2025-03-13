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
  formularioActivo: string = 'dependencia';
  avisoForm: FormGroup;

  constructor(      
    private fb: FormBuilder,
    private iniciosObraService: IniciosObraService,
    private dialogRef: MatDialogRef<AgregarInicioDependenciaModalComponent>
    ) {
      this.avisoForm = this.fb.group({
        claveObra: ['', Validators.required],
        noFolio: ['', Validators.required],
        nomDirigido: ['', Validators.required],
        cargo: ['', Validators.required],
        fechaIngreso: ['', Validators.required],
        fechaRecibo: ['', Validators.required],
        observaciones: [''],
        cumpleAviso: ['', Validators.required],
        dependencia: ['', Validators.required],
        numContrato: [''],
        contratista: [''],
        nombreObra: ['', Validators.required],
        municipio: ['', Validators.required],
        localidad: ['', Validators.required],
        tipoRecurso: ['', Validators.required],
        fondo: [''],
        montoContratado: [''],
        fechaInicio: [''],
        fechaTermino: ['']
      });    
    }

    guardarAviso(): void {
      if (this.avisoForm.valid) {
        this.iniciosObraService.agregarAvisoDependencia(this.avisoForm.value).subscribe({
          next: (response) => {
            console.log('Aviso registrado correctamente:', response);
            this.dialogRef.close(true); // Cierra el modal y devuelve `true` para actualizar la tabla
          },
          error: (error) => {
            console.error('Error al registrar el aviso:', error);
          }
        });
      } else {
        console.log('Formulario no válido');
      }
    }

    cambiarFormulario(tipo: string) {
      this.formularioActivo = tipo;
    }
    
    cerrarModal(): void {
      this.dialogRef.close();
    }

}
