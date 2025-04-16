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
  visitasDelDia: Visita[] = [];
  visitasArchivo: any[] = [];
  mostrarArchivo: boolean = false; // false = modo "hoy", true = modo "archivo"
  fechaActual: Date = new Date();

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

    this.cargarVisitasDelDia();
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
  }

  // 👉 Alterna entre visitas del día y archivo
  alternarVista(): void {
    this.mostrarArchivo = !this.mostrarArchivo;

    if (this.mostrarArchivo) {
      this.cargarArchivoVisitas();
    } else {
      this.cargarVisitasDelDia();
    }
  }

  // 👉 Carga visitas del día
  cargarVisitasDelDia(): void {
    this.visitasService.obtenerVisitasDelDia().subscribe({
      next: (data) => this.visitasDelDia = data,
      error: (err) => console.error('Error al cargar visitas del día:', err)
    });
  }

  // 👉 Carga visitas anteriores (archivo) y las agrupa por fecha
  cargarArchivoVisitas(): void {
    this.visitasService.obtenerVisitasArchivo().subscribe({
      next: (data) => this.visitasArchivo = this.agruparPorFecha(data),
      error: (err) => console.error('Error al cargar archivo de visitas:', err)
    });
  }

  // 👉 Agrupa visitas por fecha
  agruparPorFecha(visitas: any[]): any[] {
    const agrupado: { [fecha: string]: any[] } = {};

    visitas.forEach((v) => {
      const fecha = v.fecha;
      if (!agrupado[fecha]) {
        agrupado[fecha] = [];
      }
      agrupado[fecha].push(v);
    });

    return Object.entries(agrupado).map(([fecha, visitas]) => ({ fecha, visitas }));
  }

  // 👉 Abrir modal para registrar visita
  agregarVisita(): void {
    const dialogRef = this.matDialog.open(AgregarVisitasModalComponent);

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarVisitasDelDia(); // ✅ actualizar tabla si se guardó algo
      }
    });
  }

  // 👉 Registrar hora de salida
  registrarHoraSalida(id: number): void {
    const horaActual = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

    this.visitasService.registrarHoraSalida(id, horaActual).subscribe({
      next: () => this.cargarVisitasDelDia(),
      error: (err) => console.error('Error al registrar hora de salida', err)
    });
  }

  // 👉 Abrir modal para editar visita
  editarVisita(visita: any): void {
    const dialogRef = this.matDialog.open(EditarVisitasModalComponent, {
      data: visita
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === true) {
        this.cargarVisitasDelDia(); // ✅ actualizar tabla si se editó
      }
    });
  }
}
