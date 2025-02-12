import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-agregar-empleados-modal',
  templateUrl: './agregar-empleados-modal.component.html',
  styleUrls: ['./agregar-empleados-modal.component.css']
})
export class AgregarEmpleadosModalComponent implements OnInit {
  empleadoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private dialogRef: MatDialogRef<AgregarEmpleadosModalComponent>
  ) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      direccion: ['DICO', Validators.required]
    });
  }

  guardarEmpleado(): void {
    if (this.empleadoForm.valid) {
      this.empleadosService.agregarEmpleado(this.empleadoForm.value).subscribe(
        () => {          
          this.dialogRef.close(true); // Cierra el modal y recarga la tabla
        },
        (error) => {
          console.error('Error al agregar empleado:', error);
        }
      );
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
