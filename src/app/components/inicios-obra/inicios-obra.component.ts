import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IniciosObraService } from '../../services/inicios-obra.service';
import { AgregarInicioMunicipioModalComponent } from '../../modals/agregar-inicio-municipio-modal/agregar-inicio-municipio-modal.component';
import { AgregarInicioDependenciaModalComponent } from '../../modals/agregar-inicio-dependencia-modal/agregar-inicio-dependencia-modal.component';
import { Municipio, Localidad } from '../../services/inicios-obra.service';
import { EditarInicioMunicipioModalComponent } from '../../modals/editar-inicio-municipio-modal/editar-inicio-municipio-modal.component';
import { EditarInicioDependenciaModalComponent } from '../../modals/editar-inicio-dependencia-modal/editar-inicio-dependencia-modal.component';

import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-inicios-obra',
  templateUrl: './inicios-obra.component.html',
  styleUrl: './inicios-obra.component.css'
})
export class IniciosObraComponent implements OnInit {
  anios: number[] = [];
  fondos: string[] = [];
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

  private extraerAnio(fecha: any): number | null {
    if (!fecha) return null;
    // Si ya es Date
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      return fecha.getFullYear();
    }
    // Si viene como string/number
    const d = new Date(fecha);
    if (!isNaN(d.getTime())) return d.getFullYear();

    // Fallback simple por texto: intenta separar por "-" o "/"
    try {
      const s = String(fecha);
      const parts = s.includes('-') ? s.split('-') : s.split('/');
      // Casos comunes: "YYYY-MM-DD" o "DD/MM/YYYY"
      if (parts.length === 3) {
        if (parts[0].length === 4) return parseInt(parts[0], 10); // YYYY-...
        return parseInt(parts[2], 10); // .../YYYY
      }
    } catch {}
    return null;
  }

  private generarAnios(desde: number = 2015): void {
    const actual = new Date().getFullYear();
    this.anios = Array.from({ length: (actual - desde + 1) }, (_, i) => desde + i);
  }

  private actualizarFondosDisponibles(): void {
    const set = new Set<string>();
    for (const a of this.avisos) {
      const f = String(a?.fondo ?? '').trim();
      if (f) set.add(f.toUpperCase()); // normaliza
    }
    this.fondos = Array.from(set).sort();

    // Si el fondo seleccionado ya no existe en el nuevo catálogo, límpialo
    if (this.filtroFondo && !this.fondos.includes(this.filtroFondo.toUpperCase())) {
      this.filtroFondo = '';
    }
  }

  private toNumber(v: any): number {
    if (v === null || v === undefined) return NaN;
    if (typeof v === 'number') return v;
    // Quita símbolos y separadores de miles; respeta el punto decimal
    const s = String(v).replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? NaN : n;
  }

  private parseRangoMonto(value: string): { min: number; max: number } | null {
    if (!value) return null;

    // Mapeo explícito de tus opciones actuales
    if (value === '$0 - $100,000') return { min: 0, max: 100000 };
    if (value === '$100,001 - $500,000') return { min: 100001, max: 500000 };
    if (value === '$500,001 - $1,000,000') return { min: 500001, max: 1000000 };
    if (value === '$1,000,001 +' || value === '1,000,001 +' || value === '1 000 001 +' || /\+\s*$/.test(value)) {
      return { min: 1000001, max: Infinity };
    }

    // Fallback genérico por si cambian los rangos en el futuro
    const hasX = /x/i.test(value) || /\+\s*$/.test(value);
    const nums = value.match(/[\d.,]+/g);
    if (nums && nums.length >= 1) {
      const min = this.toNumber(nums[0]);
      if (hasX) return Number.isFinite(min) ? { min, max: Infinity } : null;
      if (nums.length >= 2) {
        const max = this.toNumber(nums[1]);
        if (Number.isFinite(min) && Number.isFinite(max)) return { min, max };
      }
    }
    return null;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const c = hex.replace('#', '');
    const bigint = parseInt(c, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  private fmtDate(v: any): string {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : new Intl.DateTimeFormat('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(d);
  }

  private fmtMoney(v: any): string {
    const n = this.toNumber(v);
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
  }

  private safe(v: any): string {
    if (v === null || v === undefined || v === '') return '—';
    return String(v);
  }

  private construirFilasParaPdf(aviso: any): RowInput[] {
    const filas: RowInput[] = [];
    const push = (campo: string, valor: any, tipo?: 'fecha' | 'money') => {
      let out = this.safe(valor);
      if (tipo === 'fecha') out = this.fmtDate(valor);
      if (tipo === 'money') out = this.fmtMoney(valor);
      filas.push([campo, out]);
    };

    // Campos comunes
    push('No. Folio', aviso.noFolio);
    push('Nombre quien dirige a la Contraloría', aviso.nomDirigido);
    push('Cargo', aviso.cargo);
    push('Fecha de ingreso SC', aviso.fechaIngreso, 'fecha');
    push('Fecha que recibe DICO', aviso.fechaRecibo, 'fecha');
    push('Observaciones', aviso.observaciones);
    push('Cumple aviso de inicio', aviso.cumpleAviso);
    if (this.tipoSeleccionado === 'dependencias') push('Dependencia que ejecuta', aviso.dependencia);

    push('Nombre de la obra', aviso.nombreObra);
    push('Municipio', aviso.municipio);
    push('Localidad', aviso.localidad);
    push('Clave de obra', aviso.claveObra);
    push('Tipo de recurso', aviso.tipoRecurso);
    push('Fondo', aviso.fondo);
    push('Monto contratado', aviso.montoContratado, 'money');
    if (this.tipoSeleccionado === 'municipios') push('Monto autorizado', aviso.montoAutorizado, 'money');
    push('Número de contrato', aviso.numContrato);
    push('Fecha de inicio de obra', aviso.fechaInicio, 'fecha');
    push('Fecha de término de obra', aviso.fechaTermino, 'fecha');
    push('Contratista', aviso.contratista);

    // Datos de contratista
    push('Folio (contratista)', aviso.folioContratista);
    push('Nombre quien dirige (contratista)', aviso.nomDirigidoContratista);
    push('Cargo (contratista)', aviso.cargoContratista);
    push('Fecha ingreso SC (contratista)', aviso.fechaIngresoContratista, 'fecha');
    push('Fecha que recibe DICO (contratista)', aviso.fechaReciboContratista, 'fecha');
    push('Observaciones (contratista)', aviso.observacionesContratista);
    push('Cumplen contratistas', aviso.cumpleContratista);

    return filas;
  }



  ngOnInit(): void {
    this.obtenerAvisos();
    this.cargarMunicipios();
    this.cargarLocalidadesInicial();
    this.generarAnios(2015);

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
          this.actualizarFondosDisponibles();
          this.aplicarFiltros();
        },
        error: (error) => console.error('Error al obtener avisos de municipios:', error)
      });
    } else {
      this.iniciosObraService.obtenerAvisosDependencias().subscribe({
        next: (data) => {
          this.avisos = data;
          this.actualizarFondosDisponibles();
          this.aplicarFiltros();
        },
        error: (error) => console.error('Error al obtener avisos de dependencias:', error)
      });
    }
  }

  aplicarFiltros(): void {
    const clave = (this.filtroClave || '').trim().toLowerCase();
    const folio = (this.filtroFolio || '').trim().toLowerCase();
    const contratista = (this.filtroContratista || '').trim().toLowerCase();
    const municipioNombre = (this.municipios.find(m => m.clave === this.selectedMunicipioClave)?.nombre || '').trim().toLowerCase();
    const localidadNombre = (this.localidadesAll.find(l => l.clave === this.selectedLocalidadClave)?.nombre || '').trim().toLowerCase();
    const anio = this.filtroAnio ? parseInt(this.filtroAnio, 10) : null;
    const recursoFiltro = (this.filtroRecurso || '').trim().toUpperCase();
    const fondoFiltro = (this.filtroFondo || '').trim().toUpperCase();
    const rangoMonto    = this.parseRangoMonto(this.filtroMonto);

    let cumpleFiltro: 'SI' | 'NO' | null = null;
    if (this.filtroCumple) {
      const f = this.filtroCumple.toString().trim().toLowerCase();
      if (f === 'sí' || f === 'si') cumpleFiltro = 'SI';
      else if (f === 'no') cumpleFiltro = 'NO';
    }

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
      // 3) contratista
      if (contratista) {
        const vContratista = String(aviso?.contratista ?? '').toLowerCase();
        if (!vContratista.includes(contratista)) return false;
      }
      // 4) municipio (comparación por nombre)
      if (this.selectedMunicipioClave) {
        const vMunicipio = String(aviso?.municipio ?? '').trim().toLowerCase();
        // Igualdad estricta por nombre normalizado
        if (vMunicipio !== municipioNombre) return false;
      }
      // 5) localidad (comparación por nombre)
      if (this.selectedLocalidadClave) {
        const vLocalidad = String(aviso?.localidad ?? '').trim().toLowerCase();
        if (vLocalidad !== localidadNombre) return false;
      }
      // 6) año (de fechaRecibo)
      if (anio !== null) {
        const y = this.extraerAnio(aviso?.fechaRecibo);
        if (y !== anio) return false;
      }
      // 7) cumpleAviso (SI/NO)
      if (cumpleFiltro) {
        const vCumple = String(aviso?.cumpleAviso ?? '').trim().toUpperCase();
        if (vCumple !== cumpleFiltro) return false;
      }
      // 8) tipoRecurso (MUNICIPAL / ESTATAL / FEDERAL)
      if (recursoFiltro) {
        const vRecurso = String(aviso?.tipoRecurso ?? '').trim().toUpperCase();
        if (vRecurso !== recursoFiltro) return false;
      }
      // 9) fondo
      if (fondoFiltro) {
        const vFondo = String(aviso?.fondo ?? '').trim().toUpperCase();
        if (vFondo !== fondoFiltro) return false;
      }
      // 10) montoContratado (rango)
      if (rangoMonto) {
        const monto = this.toNumber(aviso?.montoContratado);
        if (!Number.isFinite(monto)) return false;
        if (monto < rangoMonto.min || monto > rangoMonto.max) return false;
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
    this.aplicarFiltros();//actualizamos los filtros
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

  descargarPdf(aviso: any): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margen = 14;
    const claveTitulo = aviso?.claveObra || aviso?.noFolio || '';
    const titulo = `Aviso de Inicio de Obra${claveTitulo ? ' - ' + claveTitulo : ''}`;
    const rgbCab = this.hexToRgb('#9A566A');

    // Título
    doc.setFontSize(14);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(titulo, pageWidth / 2, 16, { align: 'center' });

    // Tabla
    const body = this.construirFilasParaPdf(aviso);

    autoTable(doc, {
      startY: 26,
      head: [['Campo', 'Contenido']],
      body,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: rgbCab,        // #9A566A
        textColor: [255, 255, 255],
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [242, 242, 242] }, // #f2f2f2
      columnStyles: {
        0: { cellWidth: 65 },     // "Campo"
        1: { cellWidth: 'auto' }  // "Contenido"
      },
      margin: { left: margen, right: margen }
    });

    const nombre = `Aviso_${this.safe(aviso.claveObra) || this.safe(aviso.noFolio) || 'obra'}.pdf`;
    doc.save(nombre);
  }

  editarAviso(aviso: any) {
    if (this.tipoSeleccionado === 'municipios') {
      this.matDialog.open(EditarInicioMunicipioModalComponent, {
        width: '980px',
        data: { aviso }
      }).afterClosed().subscribe(ok => {
        if (ok) this.obtenerAvisos();
      });
    } else {
      this.matDialog.open(EditarInicioDependenciaModalComponent, {
        width: '980px',
        data: { aviso }
      }).afterClosed().subscribe(ok => {
        if (ok) this.obtenerAvisos();
      });
    }
  }

}
