import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IniciosObraService } from '../../services/inicios-obra.service';
import { AgregarInicioMunicipioModalComponent } from '../../modals/agregar-inicio-municipio-modal/agregar-inicio-municipio-modal.component';
import { AgregarInicioDependenciaModalComponent } from '../../modals/agregar-inicio-dependencia-modal/agregar-inicio-dependencia-modal.component';
import { Municipio, Localidad } from '../../services/inicios-obra.service';

@Component({
  selector: 'app-inicios-obra',
  templateUrl: './inicios-obra.component.html',
  styleUrl: './inicios-obra.component.css'
})
export class IniciosObraComponent implements OnInit {
  avisos: any[] = [];
  avisosFiltrados: any[] = [];
  tipoSeleccionado: string = 'municipios';
  isAsideCollapsed = false;

  municipios: Municipio[] = [];
  localidadesAll: Localidad[] = [];   // TODAS las localidades
  localidades: Localidad[] = [];      // Las que se muestran según selección

  selectedMunicipioClave: string = '';
  selectedLocalidadClave: string = '';

  // Filtros (solo visual por ahora)
  filtroClave: string = '';
  filtroFolio: string = '';
  filtroContratista: string = '';
  filtroAnio: string = '';
  filtroCumple: string = '';
  filtroRecurso: string = '';
  filtroFondo: string = '';
  filtroMonto: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private iniciosObraService: IniciosObraService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerAvisos();
    this.cargarMunicipios();
    this.cargarLocalidadesInicial();

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
      this.iniciosObraService.obtenerAvisosMunicipios().subscribe({
        next: (data) => {
          this.avisos = data;
          this.aplicarFiltros(); // <-- NUEVO: inicializa filtrado
        },
        error: (error) => console.error('Error al obtener avisos de municipios:', error)
      });
    } else {
      this.iniciosObraService.obtenerAvisosDependencias().subscribe({
        next: (data) => {
          this.avisos = data;
          this.aplicarFiltros(); // <-- NUEVO
        },
        error: (error) => console.error('Error al obtener avisos de dependencias:', error)
      });
    }
  }

  aplicarFiltros(): void {
    const clave = (this.filtroClave || '').trim().toLowerCase();
    const folio = (this.filtroFolio || '').trim().toLowerCase();

    this.avisosFiltrados = this.avisos.filter(aviso => {
      // 1) claveObra 
      if (clave) {
        const valor = String(aviso?.claveObra || '').toLowerCase();
        if (!valor.includes(clave)) return false;
      }
      // 2) noFolio (el de la BD)
      if (folio) {
        const vFolio = String(aviso?.noFolio ?? '').toLowerCase();
        if (!vFolio.includes(folio)) return false;
      }
      return true; // (aquí iremos encadenando más filtros después)
    });
  }


  cambiarTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.obtenerAvisos();
  }

  abrirModalAgregarInicios() {
    let dialogRef;
  
    if (this.tipoSeleccionado === 'municipios') {
      dialogRef = this.matDialog.open(AgregarInicioMunicipioModalComponent);
    } else {
      dialogRef = this.matDialog.open(AgregarInicioDependenciaModalComponent);
    }
  
    // Suscribirse a afterClosed() para actualizar la tabla cuando el modal se cierre
    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // Solo actualiza si el modal cerró con éxito (result = true)
        this.obtenerAvisos();
      }
    });
  }

  cargarMunicipios(): void {    
    this.iniciosObraService.obtenerCatalogoMunicipios().subscribe({
      next: (data: Municipio[]) => (this.municipios = data),
      error: (e) => console.error('Error al cargar municipios:', e)
    });
  }

  cargarLocalidadesInicial(): void {
    // Trae TODAS para mostrarlas por defecto
    this.iniciosObraService.obtenerLocalidades().subscribe({
      next: (data) => {
        this.localidadesAll = data;
        this.localidades = [...data]; // por defecto: todas visibles
      },
      error: (e) => console.error('Error al cargar localidades:', e)
    });
  }

  onMunicipioChange(): void {
    // Si no hay municipio seleccionado, mostrar TODAS
    if (!this.selectedMunicipioClave) {
      this.localidades = [...this.localidadesAll];
    } else {
      // Filtra en cliente a partir de TODAS (sin pedir de nuevo al servidor)
      this.localidades = this.localidadesAll.filter(
        l => l.claveMunicipio === this.selectedMunicipioClave
      );
    }
    // Resetear selección de localidad
    this.selectedLocalidadClave = '';
  }

  limpiarFiltros(): void {
    // Inputs de texto
    this.filtroClave = '';
    this.filtroFolio = '';
    this.filtroContratista = '';

    // Selects
    this.selectedMunicipioClave = '';
    this.selectedLocalidadClave = '';
    this.filtroAnio = '';
    this.filtroCumple = '';
    this.filtroRecurso = '';
    this.filtroFondo = '';
    this.filtroMonto = '';

    // Restablecer lista de localidades visibles
    this.localidades = [...this.localidadesAll];

    this.aplicarFiltros();
  }



}
