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
  contratistaForm: FormGroup;

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
      cumpleAviso: ['SI', Validators.required],
      nombreObra: ['', Validators.required],
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
      claveObra: ['', Validators.required],
      tipoRecurso: ['FEDERAL', Validators.required],
      fondo: [''],
      montoAutorizado: [''],
      montoContratado: [''],
      numContrato: [''],
      fechaInicio: [''],
      fechaTermino: [''],
      contratista: ['']
    });
    this.contratistaForm = this.fb.group({
      claveObra: ['', Validators.required],
      noFolio: ['', Validators.required],
      nomDirigido: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaRecibo: ['', Validators.required],
      observaciones: [''],
      cumpleAviso: ['SI', Validators.required]
    });
  
  }
  cambiarFormulario(tipo: string): void {
    console.log(`Cambiando a formulario: ${tipo}`); // Debug
    this.formularioActivo = tipo;
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
  guardarContratista() {
    if (this.contratistaForm.valid) {
      this.iniciosObraService.guardarAvisoContratistaMunicipio(this.contratistaForm.value).subscribe(
        (response) => {
          console.log('Aviso de contratista (municipio) guardado:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al guardar aviso de contratista (municipio):', error);
        }
      );
    }
  }
  guardar(): void {
  if (this.formularioActivo === 'contratista') {
    this.guardarContratista();
  } else {
    this.guardarAviso();
  }
}

  
  
  cerrarModal(): void {
    this.dialogRef.close();
  }
}
