import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cerrar-sesion-modal',
  templateUrl: './cerrar-sesion-modal.component.html',
  styleUrl: './cerrar-sesion-modal.component.css'
})
export class CerrarSesionModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CerrarSesionModalComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    console.log("Sesión cerrada correctamente.");
    this.dialogRef.close(true); // Indica que se confirmó el cierre de sesión
  }

  cerrarModal(): void {
    this.dialogRef.close(false); // Cancela el cierre de sesión
  }
}
