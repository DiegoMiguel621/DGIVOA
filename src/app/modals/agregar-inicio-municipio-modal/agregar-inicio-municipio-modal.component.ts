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
  formularioActivo: string = 'municipio';
  avisoForm: FormGroup;

  constructor(      
    private fb: FormBuilder,
    private iniciosObraService: IniciosObraService,
    private dialogRef: MatDialogRef<AgregarInicioMunicipioModalComponent>
  ) {
    this.avisoForm = this.fb.group({
      noFolio: ['', Validators.required],
      nomDirigido: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaRecibo: ['', Validators.required],
      observaciones: [''],
      cumpleAviso: ['', Validators.required],
      nombreObra: ['', Validators.required],
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
      claveObra: ['', Validators.required],
      tipoRecurso: ['', Validators.required],
      fondo: [''],
      montoAutorizado: [''],
      montoContratado: [''],
      numContrato: [''],
      fechaInicio: [''],
      fechaTermino: [''],
      contratista: ['']
    });
  }

  guardarAviso(): void {
    if (this.avisoForm.valid) {
      this.iniciosObraService.agregarAvisoMunicipio(this.avisoForm.value).subscribe(
        response => {
          console.log('Aviso de inicio registrado:', response);
          this.dialogRef.close(true); // Cerrar modal y actualizar tabla
        },
        error => {
          console.error('Error al registrar el aviso:', error);
        }
      );
    } else {
      console.log('Formulario no válido, revisa los campos.');
    }
  }
  
  cambiarFormulario(tipo: string) {
    this.formularioActivo = tipo;
  }
  
  cerrarModal(): void {
    this.dialogRef.close();
  }
}
