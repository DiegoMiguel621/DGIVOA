import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-cambiar-contrasena-modal',
  templateUrl: './cambiar-contrasena-modal.component.html',
  styleUrl: './cambiar-contrasena-modal.component.css'
})
export class CambiarContrasenaModalComponent implements OnInit {
  empleadoForm!: FormGroup;
  usuario: any;
  mostrarContrasena: boolean = false;
  contrasenaOculta: string = '';

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CambiarContrasenaModalComponent>
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();

    // 🔹 Transformar la contraseña en viñetas "••••••"
    this.contrasenaOculta = '•'.repeat(this.usuario.contraseña.length);

    this.empleadoForm = this.fb.group({
      correo: [this.usuario.correo, [Validators.required, Validators.email]],
      contraseña: [this.usuario.contraseña, Validators.required] // Se guarda la contraseña real en el campo
    });
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  guardarCambios(): void {
    if (this.empleadoForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const datosActualizados = this.empleadoForm.value;

    this.empleadosService.actualizarEmpleado(this.usuario.id_empleado, datosActualizados).subscribe(
      (response) => {
        console.log('Usuario actualizado:', response);

        // 🔹 ACTUALIZAMOS LA INFO EN EL AUTH SERVICE PARA REFLEJAR LOS CAMBIOS EN EL PERFIL
        this.usuario.correo = datosActualizados.correo;
        this.usuario.contraseña = datosActualizados.contraseña;
        this.authService.actualizarUsuario(this.usuario);

        // 🔹 CERRAMOS EL MODAL Y PASAMOS LOS NUEVOS DATOS
        this.dialogRef.close(datosActualizados);
      },
      (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    );
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
