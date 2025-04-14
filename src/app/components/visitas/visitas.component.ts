import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VisitasService, Visita } from '../../services/visitas.service';
import { AgregarVisitasModalComponent } from '../../modals/agregar-visitas-modal/agregar-visitas-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditarVisitasModalComponent } from '../../modals/editar-visitas-modal/editar-visitas-modal.component';


@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrl: './visitas.component.css'
})
export class VisitasComponent implements OnInit {
  isAsideCollapsed = false;
  visitas: Visita[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private matDialog: MatDialog,
    private visitasService: VisitasService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }

    this.cargarVisitas();
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }

  cargarVisitas(): void {
    this.visitasService.obtenerVisitas().subscribe({
      next: (data) => this.visitas = data,
      error: (err) => console.error('Error al obtener visitas:', err)
    });
  }


  agregarVisita(): void {
    const dialogRef = this.matDialog.open(AgregarVisitasModalComponent);

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarVisitas(); // 🔄 actualiza la tabla solo si hubo cambios
      }
    });
  }

  registrarHoraSalida(id: number): void {
    const horaActual = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

    this.visitasService.registrarHoraSalida(id, horaActual).subscribe({
      next: () => this.cargarVisitas(), // 🔄 recargar lista
      error: (err) => console.error('Error al registrar hora de salida', err)
    });
  }


  editarVisita(): void {
    console.log("Intentando abrir el modal...");
    if (isPlatformBrowser(this.platformId)) {
      const dialogRef = this.matDialog.open(EditarVisitasModalComponent);
      dialogRef.afterClosed().subscribe(() => {
        console.log("El modal se cerró");
      });
    }
  }



}
