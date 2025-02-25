import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CambiarContrasenaModalComponent } from '../../modals/cambiar-contrasena-modal/cambiar-contrasena-modal.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  isAsideCollapsed = false;
  usuario: any = null;
  mostrarContrasena: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    console.log("Datos del usuario en perfil:", this.usuario);
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  abrirModalCambio(): void {
    const dialogRef = this.matDialog.open(CambiarContrasenaModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 🔹 ACTUALIZAMOS LOS DATOS EN EL PERFIL
        this.usuario.correo = result.correo;
        this.usuario.contraseña = result.contraseña;
      }
    });
  }
}
