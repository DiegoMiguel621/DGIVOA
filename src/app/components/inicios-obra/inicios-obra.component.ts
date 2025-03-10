import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IniciosObraService } from '../../services/inicios-obra.service';
import { AgregarInicioMunicipioModalComponent } from '../../modals/agregar-inicio-municipio-modal/agregar-inicio-municipio-modal.component';
import { AgregarInicioDependenciaModalComponent } from '../../modals/agregar-inicio-dependencia-modal/agregar-inicio-dependencia-modal.component';

@Component({
  selector: 'app-inicios-obra',
  templateUrl: './inicios-obra.component.html',
  styleUrl: './inicios-obra.component.css'
})
export class IniciosObraComponent implements OnInit {
  avisos: any[] = [];
  tipoSeleccionado: string = 'municipios';
  
  isAsideCollapsed = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private iniciosObraService: IniciosObraService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerAvisos();
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

  obtenerAvisos(): void {
    if (this.tipoSeleccionado === 'municipios') {
      this.iniciosObraService.obtenerAvisosMunicipios().subscribe(
        data => this.avisos = data,
        error => console.error('Error al obtener avisos de municipios:', error)
      );
    } else {
      this.iniciosObraService.obtenerAvisosDependencias().subscribe(
        data => this.avisos = data,
        error => console.error('Error al obtener avisos de dependencias:', error)
      );
    }
}


  cambiarTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.obtenerAvisos();
  }

  abrirModalAgregarInicios() {
    if (this.tipoSeleccionado === 'municipios') {
      const dialogRef = this.matDialog.open(AgregarInicioMunicipioModalComponent);
    } else {
      const dialogRef = this.matDialog.open(AgregarInicioDependenciaModalComponent);
    }
  }

}
