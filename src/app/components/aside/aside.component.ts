import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CerrarSesionModalComponent } from '../../modals/cerrar-sesion-modal/cerrar-sesion-modal.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  isCollapsed: boolean = false;
  @Output() asideToggled = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isCollapsed = (collapsedFromStorage === 'true');
      }
    }
  }

  toggleAside(): void {
    this.isCollapsed = !this.isCollapsed;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('asideCollapsed', this.isCollapsed.toString());
    }
    this.asideToggled.emit(this.isCollapsed);
  }

  abrirModalCerrarSesion(): void {
    const dialogRef = this.matDialog.open(CerrarSesionModalComponent, {
      width: '350px' // Ajusta el tamaño si es necesario
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cerrarSesion();
      }
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    console.log("Sesión cerrada correctamente.");
    this.router.navigate(['/login']); // Redirige a login
  }
}
