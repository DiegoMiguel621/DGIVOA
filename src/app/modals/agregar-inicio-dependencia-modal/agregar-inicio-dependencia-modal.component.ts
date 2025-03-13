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
  contratistaForm: FormGroup;

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
      this.contratistaForm = this.fb.group({
        claveObra: ['', Validators.required],
        noFolio: ['', Validators.required],
        nomDirigido: ['', Validators.required],
        cargo: ['', Validators.required],
        fechaIngreso: ['', Validators.required],
        fechaRecibo: ['', Validators.required],
        observaciones: [''],
        cumpleAviso: ['', Validators.required]
      });
    }
    cambiarFormulario(tipo: string): void {
      console.log(`Cambiando a formulario: ${tipo}`); // Debug
      this.formularioActivo = tipo;
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

    guardarContratista() {
      if (this.contratistaForm.valid) {
        this.iniciosObraService.guardarAvisoContratistaDependencia(this.contratistaForm.value).subscribe(
          (response) => {
            console.log('Aviso de contratista (dependencia) guardado:', response);
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al guardar aviso de contratista (dependencia):', error);
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
