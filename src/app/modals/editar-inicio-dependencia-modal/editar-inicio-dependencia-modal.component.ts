import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService, Municipio, Localidad } from '../../services/inicios-obra.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type DataEntrada = {
  aviso?: any;        // puedes inyectar el registro ya armado desde la tabla
  claveObra?: string; // o sólo la clave para que el modal la busque
};

@Component({
  selector: 'app-editar-inicio-dependencia-modal',
  templateUrl: './editar-inicio-dependencia-modal.component.html',
  styleUrls: ['./editar-inicio-dependencia-modal.component.css']
})
export class EditarInicioDependenciaModalComponent implements OnInit {

  formularioActivo: 'dependencia' | 'contratista' = 'dependencia';

  avisoForm!: FormGroup;
  contratistaForm!: FormGroup;

  municipios: Municipio[] = [];
  localidades: Localidad[] = [];

  /** Clave con la que originalmente abrimos el modal (sirve para actualizar aunque la editen). */
  claveOriginal: string | null = null;

  /** Si existe registro de contratista para esta clave. */
  contratistaExiste = false;

  constructor(
    private fb: FormBuilder,
    private iniciosObraService: IniciosObraService,
    private dialogRef: MatDialogRef<EditarInicioDependenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataEntrada
  ) {}

  ngOnInit(): void {
    this.construirFormularios();

    // Cargar catálogos + determinar fuente del aviso (inyectado o por clave)
    this.iniciosObraService.obtenerCatalogoMunicipios().pipe(
      switchMap(muns => {
        this.municipios = muns || [];

        if (this.data?.aviso) return of(this.data.aviso);
        if (this.data?.claveObra) {
          return this.iniciosObraService.obtenerAvisoDependenciaPorClave(this.data.claveObra);
        }
        return of({});
      })
    ).subscribe({
      next: (aviso) => {
        this.patchDesdeAviso(aviso || {});
        const clave = this.claveOriginal || this.avisoForm.get('claveObra')?.value || '';
        if (clave) {
          // Traer contratista (si hay) para esta clave
          this.iniciosObraService.obtenerAvisoDependenciaContratistaPorClave(clave).subscribe({
            next: (c) => {
              if (c && Object.keys(c).length) {
                this.contratistaExiste = true;
                this.patchContratista(c);
              }
            },
            error: () => { /* puede no existir; no es error crítico */ }
          });
        }
      },
      error: (e) => console.error('Error cargando datos de edición (dependencias):', e)
    });

    // Al cambiar municipio en el editor → recargar localidades
    this.avisoForm.get('municipio')?.valueChanges.subscribe((claveMun: string) => {
      this.cargarLocalidades(claveMun);
      this.avisoForm.get('localidad')?.setValue('');
    });
  }

  private construirFormularios(): void {
    // Edición: sin Validators (salvo que quieras exigir algo), para que permita guardar libremente.
    this.avisoForm = this.fb.group({
      claveObra: [''],
      noFolio: [''],
      nomDirigido: [''],
      cargo: [''],
      fechaIngreso: [''],
      fechaRecibo: [''],
      observaciones: [''],
      cumpleAviso: [''],
      dependencia: [''],
      nombreObra: [''],

      // UI guarda CLAVE; en la BD guardas NOMBRE → convertimos al guardar.
      municipio: [''],
      // En BD guardas NOMBRE de localidad
      localidad: [''],

      tipoRecurso: [''],
      fondo: [''],
      numContrato: [''],
      contratista: [''],
      montoContratado: [''],
      fechaInicio: [''],
      fechaTermino: ['']
    });

    this.contratistaForm = this.fb.group({
      claveObra: [''],
      noFolio: [''],
      nomDirigido: [''],
      cargo: [''],
      fechaIngreso: [''],
      fechaRecibo: [''],
      observaciones: [''],
      cumpleAviso: ['']
    });
  }

  private patchDesdeAviso(aviso: any): void {
    this.claveOriginal = aviso.claveObra || this.data?.claveObra || null;

    const claveMun = this.claveDesdeNombre((aviso.municipio ?? '').toString());

    const fechaIngreso = this.toDateInput(aviso.fechaIngreso);
    const fechaRecibo  = this.toDateInput(aviso.fechaRecibo);
    const fechaInicio  = this.toDateInput(aviso.fechaInicio);
    const fechaTermino = this.toDateInput(aviso.fechaTermino);

    this.avisoForm.patchValue({
      claveObra: aviso.claveObra ?? '',
      noFolio: aviso.noFolio ?? '',
      nomDirigido: aviso.nomDirigido ?? '',
      cargo: aviso.cargo ?? '',
      fechaIngreso,
      fechaRecibo,
      observaciones: aviso.observaciones ?? '',
      cumpleAviso: aviso.cumpleAviso ?? '',
      dependencia: aviso.dependencia ?? '',
      nombreObra: aviso.nombreObra ?? '',
      municipio: claveMun || '',
      localidad: aviso.localidad ?? '',
      tipoRecurso: aviso.tipoRecurso ?? '',
      fondo: (aviso.fondo ?? '').toString().toUpperCase(),
      numContrato: aviso.numContrato ?? '',
      contratista: aviso.contratista ?? '',
      montoContratado: aviso.montoContratado ?? '',
      fechaInicio,
      fechaTermino
    });

    if (claveMun) {
      this.cargarLocalidades(claveMun, aviso.localidad);
    } else {
      this.localidades = [];
    }
  }

  private patchContratista(c: any): void {
    this.contratistaForm.patchValue({
      claveObra: c.claveObra ?? this.claveOriginal ?? '',
      noFolio: c.noFolio ?? '',
      nomDirigido: c.nomDirigido ?? '',
      cargo: c.cargo ?? '',
      fechaIngreso: this.toDateInput(c.fechaIngreso),
      fechaRecibo: this.toDateInput(c.fechaRecibo),
      observaciones: c.observaciones ?? '',
      cumpleAviso: c.cumpleAviso ?? ''
    });
  }

  private cargarLocalidades(claveMunicipio: string, localidadASeleccionar?: string): void {
    if (!claveMunicipio) { this.localidades = []; return; }
    this.iniciosObraService.obtenerLocalidades(claveMunicipio).subscribe({
      next: (locs) => {
        this.localidades = locs || [];
        if (localidadASeleccionar) {
          const hit = this.localidades.some(
            l => this.norm(l.nombre) === this.norm(localidadASeleccionar)
          );
          if (hit) this.avisoForm.get('localidad')?.setValue(localidadASeleccionar);
        }
      },
      error: (e) => console.error('Error cargando localidades:', e)
    });
  }

  // ===== Helpers =====
  private toDateInput(v: any): string {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  private norm(s: string) {
    return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
  private claveDesdeNombre(nombre: string): string | null {
    if (!nombre) return null;
    const t = this.norm(nombre);
    const f = this.municipios.find(m => this.norm(m.nombre) === t);
    return f ? f.clave : null;
  }
  private nombreDesdeClave(clave: string): string | null {
    if (!clave) return null;
    const f = this.municipios.find(m => m.clave === clave);
    return f ? f.nombre : null;
  }

  // ===== UI =====
  cambiarFormulario(t: 'dependencia' | 'contratista') { this.formularioActivo = t; }
  cerrarModal() { this.dialogRef.close(false); }

  guardar(): void {
    if (this.formularioActivo === 'contratista') {
      const raw = this.contratistaForm.value;
      const claveParaActualizar =
        this.claveOriginal ||
        this.avisoForm.get('claveObra')?.value ||
        raw.claveObra ||
        '';

      if (!claveParaActualizar) {
        console.error('Falta clave de obra para actualizar contratista (dependencias).');
        return;
      }

      const payload = { ...raw, claveObra: claveParaActualizar };

      const obs = this.contratistaExiste
        ? this.iniciosObraService.actualizarAvisoContratistaDependencia(claveParaActualizar, payload)
        : this.iniciosObraService.guardarAvisoContratistaDependencia(payload);

      obs.subscribe({
        next: () => this.dialogRef.close(true),
        error: (e) => console.error('Error al guardar contratista (dependencias):', e)
      });
      return;
    }

    // Principal (dependencia)
    const raw = this.avisoForm.value;
    const municipioNombre = this.nombreDesdeClave(raw.municipio) || '';
    const payload = {
      ...raw,
      municipio: municipioNombre,
      fondo: (raw.fondo || '').toString().toUpperCase()
    };

    const claveParaActualizar = this.claveOriginal || raw.claveObra || '';
    if (!claveParaActualizar) {
      console.error('Falta clave de obra para actualizar aviso (dependencias).');
      return;
    }

    this.iniciosObraService
      .actualizarAvisoDependencia(claveParaActualizar, payload)
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (e) => console.error('Error al actualizar aviso (dependencias):', e)
      });
  }
}
