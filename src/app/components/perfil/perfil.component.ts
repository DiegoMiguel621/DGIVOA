import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { EmpleadosService } from '../../services/empleados.service';
import { MatDialog } from '@angular/material/dialog';
import { CambiarContrasenaModalComponent } from '../../modals/cambiar-contrasena-modal/cambiar-contrasena-modal.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  isAsideCollapsed = false;
  usuario: any = { foto: 'assets/images/user-default.png' }; // Evita errores en la vista
  mostrarContrasena: boolean = false;
  fotoPerfil: string = 'assets/images/user-default.png';

  @ViewChild('fileInput') fileInput!: ElementRef; // Mejora para manejar el input file en Angular

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private empleadosService: EmpleadosService,
    private matDialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();

    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

    if (this.usuario && this.usuario.foto) {
        this.fotoPerfil = this.usuario.foto.startsWith('http') ? this.usuario.foto : `http://localhost:3000/uploads/${this.usuario.foto}`;
    } else {
        this.fotoPerfil = 'assets/images/user-default.png'; 
    }
    
    console.log("Imagen de perfil cargada:", this.fotoPerfil);
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
        this.usuario.correo = result.correo;
        this.usuario.contraseña = result.contraseña;
      }
    });
  }

  cambiarFoto(event: any): void {
    const file = event.target.files[0]; 
    if (file) {
        const formData = new FormData();
        formData.append('foto', file);

        this.empleadosService.subirFoto(this.usuario.id_empleado, formData).subscribe(
            (response) => {
                console.log('Foto actualizada correctamente:', response);
                
                this.usuario.foto = response.foto; // Guarda solo el nombre del archivo
                this.fotoPerfil = `http://localhost:3000/uploads/${response.foto}`; // 🔥 Construye la URL correctamente
                this.authService.actualizarUsuario(this.usuario); // Guarda en sesión
            },
            (error) => {
                console.error('Error al subir la foto:', error);
            }
        );
    }
}

  

  restaurarFoto(): void {
    this.empleadosService.restaurarFoto(this.usuario.id_empleado).subscribe(response => {
      this.fotoPerfil = 'assets/images/user-default.png';
      this.usuario.foto = 'user-default.png';
      this.authService.actualizarUsuario(this.usuario);
    });
  }

  abrirSelectorDeArchivo(): void {
    this.fileInput.nativeElement.click();
  }
}
