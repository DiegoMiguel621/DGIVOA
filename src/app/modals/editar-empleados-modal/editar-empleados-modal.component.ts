import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-editar-empleados-modal',
  templateUrl: './editar-empleados-modal.component.html',
  styleUrl: './editar-empleados-modal.component.css'
})
export class EditarEmpleadosModalComponent {
  empleadoForm!: FormGroup;
  idEmpleado!: number;

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    public dialogRef: MatDialogRef<EditarEmpleadosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idEmpleado = data.id_empleado;

    this.empleadoForm = this.fb.group({
      nombres: [data.nombres, Validators.required],
      apellidos: [data.apellidos, Validators.required],
      correo: [data.correo, [Validators.required, Validators.email]],
      contraseña: [data.contraseña, Validators.required],
      direccion: [data.direccion, Validators.required]
    });
  }

  actualizarEmpleado(): void {
    if (this.empleadoForm.invalid) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    const empleadoActualizado = this.empleadoForm.value;
  
    this.empleadosService.actualizarEmpleado(this.idEmpleado, empleadoActualizado).subscribe(
      response => {
        if (response.success) {
          console.log('Empleado actualizado correctamente');
          this.dialogRef.close(true); // ✅ Cerramos el modal enviando "true" para indicar que se actualizó
        }
      },
      error => {
        console.error('Error al actualizar empleado:', error);
        alert('Error en el servidor, intente de nuevo');
      }
    );
  }
  
 

  cerrarModal(): void {
    this.dialogRef.close(false);
  }
}
