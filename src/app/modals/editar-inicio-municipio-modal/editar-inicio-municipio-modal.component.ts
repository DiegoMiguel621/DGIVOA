import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService, Municipio, Localidad } from '../../services/inicios-obra.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type DataEntrada = {
  aviso?: any;        // opcional: aviso ya listo para editar
  claveObra?: string; // opcional: sólo la clave para buscar en backend
};

@Component({
  selector: 'app-editar-inicio-municipio-modal',
  templateUrl: './editar-inicio-municipio-modal.component.html',
  styleUrls: ['./editar-inicio-municipio-modal.component.css']
})
export class EditarInicioMunicipioModalComponent implements OnInit {

  formularioActivo: 'municipio' | 'contratista' = 'municipio';

  avisoForm!: FormGroup;
  contratistaForm!: FormGroup;

  municipios: Municipio[] = [];
  localidades: Localidad[] = [];

  /** Clave de obra con la que abrimos el modal (para identificar el registro a actualizar) */
  claveOriginal: string | null = null;

  /** Si ya hay registro de contratista (para decidir POST/PUT) */
  contratistaExiste: boolean = false;

  cargando = false;

  constructor(
    private fb: FormBuilder,
    private iniciosObraService: IniciosObraService,
    private dialogRef: MatDialogRef<EditarInicioMunicipioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataEntrada
  ) {}

  ngOnInit(): void {
    this.construirFormularios();

    // 1) Traer catálogos primero y luego el aviso
    this.cargando = true;
    this.iniciosObraService.obtenerCatalogoMunicipios().pipe(
      switchMap((muns) => {
        this.municipios = muns || [];

        if (this.data?.aviso) {
          return of(this.data.aviso);
        }
        if (this.data?.claveObra) {
          // Asegúrate de tener este método en el service
          return this.iniciosObraService.obtenerAvisoMunicipioPorClave(this.data.claveObra);
        }
        return of({});
      })
    ).subscribe({
      next: (aviso) => {
        this.cargando = false;
        this.inicializarDesdeAviso(aviso || {});
        // Cargar contratista después de conocer la claveOriginal
        if (this.claveOriginal) {
          this.cargarContratista(this.claveOriginal);
        }
      },
      error: (e) => {
        this.cargando = false;
        console.error('Error cargando datos para edición:', e);
      }
    });
  }

  private construirFormularios(): void {
    // Edición: sin validators para no bloquear guardado
    this.avisoForm = this.fb.group({
      noFolio: [''],
      nomDirigido: [''],
      cargo: [''],
      fechaIngreso: [''],
      fechaRecibo: [''],
      observaciones: [''],
      cumpleAviso: [''],
      nombreObra: [''],

      // municipio (select) almacena CLAVE
      municipio: [''],

      // localidad (select) almacena NOMBRE (según tu BD)
      localidad: [''],

      // En edición la clave se puede modificar libremente
      claveObra: [''],

      tipoRecurso: [''],
      fondo: [''],
      montoAutorizado: [''],
      montoContratado: [''],
      numContrato: [''],
      fechaInicio: [''],
      fechaTermino: [''],
      contratista: ['']
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

    // Cuando cambie municipio en edición, recarga localidades
    this.avisoForm.get('municipio')?.valueChanges.subscribe((claveMun: string) => {
      this.cargarLocalidades(claveMun);
      // Al cambiar de municipio, limpia localidad
      this.avisoForm.get('localidad')?.setValue('');
    });
  }

  private inicializarDesdeAviso(aviso: any): void {
    if (!aviso) aviso = {};

    // Guardar clave original (para poder actualizar aunque el usuario la cambie)
    this.claveOriginal = aviso.claveObra || this.data?.claveObra || null;

    // 1) Mapear MUNICIPIO (nombre → clave para el select)
    const nombreMunicipio = (aviso.municipio ?? '').toString().trim();
    const claveMunicipio   = this.claveDesdeNombre(nombreMunicipio) || '';

    // 2) Fechas en formato yyyy-MM-dd para inputs type="date"
    const fechaIngreso  = this.toDateInput(aviso.fechaIngreso);
    const fechaRecibo   = this.toDateInput(aviso.fechaRecibo);
    const fechaInicio   = this.toDateInput(aviso.fechaInicio);
    const fechaTermino  = this.toDateInput(aviso.fechaTermino);

    // 3) Parchear formulario principal
    this.avisoForm.patchValue({
      noFolio: aviso.noFolio ?? '',
      nomDirigido: aviso.nomDirigido ?? '',
      cargo: aviso.cargo ?? '',
      fechaIngreso,
      fechaRecibo,
      observaciones: aviso.observaciones ?? '',
      cumpleAviso: aviso.cumpleAviso ?? '',
      nombreObra: aviso.nombreObra ?? '',
      municipio: claveMunicipio,                // select usa CLAVE
      localidad: aviso.localidad ?? '',         // BD guarda Nombre
      claveObra: aviso.claveObra ?? '',
      tipoRecurso: aviso.tipoRecurso ?? '',
      fondo: (aviso.fondo ?? '').toString().toUpperCase(),
      montoAutorizado: aviso.montoAutorizado ?? '',
      montoContratado: aviso.montoContratado ?? '',
      numContrato: aviso.numContrato ?? '',
      fechaInicio,
      fechaTermino,
      contratista: aviso.contratista ?? ''
    });

    // 4) Localidades para ese municipio (si hay)
    if (claveMunicipio) {
      this.cargarLocalidades(claveMunicipio, aviso.localidad);
    } else {
      this.localidades = [];
    }
  }

  private cargarLocalidades(claveMunicipio: string, localidadASeleccionar?: string): void {
    if (!claveMunicipio) {
      this.localidades = [];
      return;
    }
    this.iniciosObraService.obtenerLocalidades(claveMunicipio).subscribe({
      next: (locs) => {
        this.localidades = locs || [];
        if (localidadASeleccionar) {
          const existe = this.localidades.some(
            l => this.norm(l.nombre) === this.norm(localidadASeleccionar)
          );
          if (existe) {
            this.avisoForm.get('localidad')?.setValue(localidadASeleccionar);
          }
        }
      },
      error: (e) => console.error('Error cargando localidades:', e)
    });
  }

  // ========= CONTRATISTA =========
  private cargarContratista(clave: string): void {
    this.iniciosObraService
      .obtenerAvisoContratistaMunicipioPorClave(clave)
      .subscribe({
        next: (av) => {
          this.contratistaExiste = !!av;
          this.patchContratista(av);
        },
        error: (e) => {
          console.error('Error obteniendo contratista:', e);
          this.contratistaExiste = false;
          this.patchContratista(null);
        }
      });
  }

  private patchContratista(av: any | null): void {
    const clave = av?.claveObra
      ?? this.avisoForm.get('claveObra')?.value
      ?? this.claveOriginal
      ?? '';

    this.contratistaForm.patchValue({
      claveObra: clave,
      noFolio: av?.noFolio ?? '',
      nomDirigido: av?.nomDirigido ?? '',
      cargo: av?.cargo ?? '',
      fechaIngreso: this.toDateInput(av?.fechaIngreso),
      fechaRecibo:  this.toDateInput(av?.fechaRecibo),
      observaciones: av?.observaciones ?? '',
      cumpleAviso: av?.cumpleAviso ?? ''
    }, { emitEvent: false });
  }

  // ========= Helpers =========
  private toDateInput(v: any): string {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private norm(s: string): string {
    return (s || '')
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private claveDesdeNombre(nombre: string): string | null {
    if (!nombre) return null;
    const target = this.norm(nombre);
    const found = this.municipios.find(m => this.norm(m.nombre) === target);
    return found ? found.clave : null;
  }

  private nombreDesdeClave(clave: string): string | null {
    if (!clave) return null;
    const found = this.municipios.find(m => m.clave === clave);
    return found ? found.nombre : null;
  }

  // ========= UI =========
  cambiarFormulario(tipo: 'municipio' | 'contratista'): void {
    this.formularioActivo = tipo;
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    if (this.formularioActivo === 'contratista') {
    const raw = this.contratistaForm.value;

    const claveParaActualizar =
      this.claveOriginal ||
      this.avisoForm.get('claveObra')?.value ||
      raw.claveObra ||
      '';

    if (!claveParaActualizar) {
      console.error('Falta clave de obra para actualizar contratista.');
      return;
    }

    const payload = {
      ...raw,
      claveObra: claveParaActualizar // garantizamos que va en el body también
    };

    // ✅ PUT si existe, POST si no
    const obs = this.contratistaExiste
      ? this.iniciosObraService.actualizarAvisoContratistaMunicipio(claveParaActualizar, payload)
      : this.iniciosObraService.guardarAvisoContratistaMunicipio(payload);

    obs.subscribe({
      next: () => this.dialogRef.close(true),
      error: (e) => console.error('Error al guardar contratista (municipios):', e)
    });

    return;
  }


    // -------- Guardar pestaña MUNICIPIO --------
    const raw = this.avisoForm.value;
    const municipioNombre = this.nombreDesdeClave(raw.municipio) || '';
    const payload = {
      ...raw,
      municipio: municipioNombre,
      fondo: (raw.fondo || '').toString().toUpperCase()
    };

    const claveParaActualizar =
      this.claveOriginal || raw.claveObra || '';

    this.iniciosObraService
      .actualizarAvisoMunicipio(claveParaActualizar, payload) // ✅ orden corregido
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (e) => console.error('Error al actualizar aviso (municipios):', e)
      });

  }
}
