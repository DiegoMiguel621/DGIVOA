import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService, Localidad } from '../../services/inicios-obra.service';
import { MunicipiosService } from '../../services/municipios.service';

@Component({
  selector: 'app-agregar-inicio-dependencia-modal',
  templateUrl: './agregar-inicio-dependencia-modal.component.html',
  styleUrls: ['./agregar-inicio-dependencia-modal.component.css']
})
export class AgregarInicioDependenciaModalComponent {
  formularioActivo: string = 'dependencia';
  avisoForm: FormGroup;
  contratistaForm: FormGroup;

  // Catálogos dinámicos
  municipios: any[] = [];
  localidades: Localidad[] = [];

  // Control de autogeneración de clave
  claveObraManual = false;
  private settingClaveProgrammatically = false;

  constructor(
    private fb: FormBuilder,
    private iniciosObraService: IniciosObraService,
    private municipiosService: MunicipiosService,
    private dialogRef: MatDialogRef<AgregarInicioDependenciaModalComponent>
  ) {
    this.avisoForm = this.fb.group({
      claveObra: ['', Validators.required],
      noFolio: ['', Validators.required],
      nomDirigido: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaRecibo: ['', Validators.required],
      observaciones: [''],
      cumpleAviso: ['SI', Validators.required],
      dependencia: ['', Validators.required],
      numContrato: [''],
      contratista: [''],
      nombreObra: ['', Validators.required],
      municipio: ['', Validators.required], // guarda CLAVE
      localidad: ['', Validators.required], // guarda NOMBRE
      tipoRecurso: ['FEDERAL', Validators.required],
      fondo: [''],
      montoContratado: [''],
      fechaInicio: [''],
      fechaTermino: ['']
    });

    this.contratistaForm = this.fb.group({
      claveObra: ['', Validators.required],
      noFolio: ['', Validators.required],
      nomDirigido: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaRecibo: ['', Validators.required],
      observaciones: [''],
      cumpleAviso: ['SI', Validators.required]
    });
  }

  cambiarFormulario(tipo: string): void {
    this.formularioActivo = tipo;
  }

  ngOnInit(): void {
    // 1) Cargar municipios
    this.municipiosService.getMunicipios().subscribe({
      next: (data) => {
        this.municipios = data;

        // 2) Listeners para generar clave automáticamente
        this.avisoForm.get('fechaInicio')?.valueChanges.subscribe(() => this.generarClaveObra());
        this.avisoForm.get('fondo')?.valueChanges.subscribe(() => this.generarClaveObra());

        // 3) Al cambiar municipio: recarga localidades y regenera clave
        this.avisoForm.get('municipio')?.valueChanges.subscribe((claveMunicipio: string) => {
          this.cargarLocalidadesPorMunicipio(claveMunicipio);
          this.avisoForm.get('localidad')?.setValue('');
          this.generarClaveObra();
        });

        // 4) Si el usuario edita la clave → modo manual
        this.avisoForm.get('claveObra')?.valueChanges.subscribe(() => {
          if (!this.settingClaveProgrammatically) this.claveObraManual = true;
        });
      },
      error: (e) => console.error('Error cargando municipios', e)
    });
  }

  private cargarLocalidadesPorMunicipio(claveMunicipio: string): void {
    if (!claveMunicipio) { this.localidades = []; return; }
    this.iniciosObraService.obtenerLocalidades(claveMunicipio).subscribe({
      next: (locs) => this.localidades = locs,
      error: (e) => console.error('Error cargando localidades', e)
    });
  }

  generarClaveObra(): void {
    // Si el usuario la editó manualmente, no sobreescribir
    if (this.claveObraManual) return;

    const fechaInicio = this.avisoForm.get('fechaInicio')?.value;
    const fondo = this.avisoForm.get('fondo')?.value;
    const claveMunicipio = this.avisoForm.get('municipio')?.value;

    if (!fechaInicio || !fondo || !claveMunicipio) return;

    const anio = new Date(fechaInicio).getFullYear().toString();
    const claveFormateada = String(claveMunicipio).padStart(3, '0');

    // Para Dependencias usamos su propio consecutivo
    this.iniciosObraService.getConsecutivoDependencia(anio, claveFormateada, fondo).subscribe({
      next: (data) => {
        const consecutivo = String(data.consecutivo).padStart(3, '0');
        const claveGenerada = `${anio}/${fondo}${claveFormateada}${consecutivo}`;

        this.settingClaveProgrammatically = true;
        this.avisoForm.get('claveObra')?.setValue(claveGenerada);
        this.settingClaveProgrammatically = false;
      },
      error: (e) => console.error('Error generando clave (dependencia):', e)
    });
  }

  recalcularClaveObra(): void {
    this.claveObraManual = false;
    this.generarClaveObra();
  }

  guardarAviso(): void {
    if (this.avisoForm.valid) {
      this.iniciosObraService.agregarAvisoDependencia(this.avisoForm.value).subscribe({
        next: (response) => {
          console.log('Aviso registrado correctamente:', response);
          this.dialogRef.close(true);
        },
        error: (error) => console.error('Error al registrar el aviso:', error)
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  guardarContratista(): void {
    if (this.contratistaForm.valid) {
      this.iniciosObraService.guardarAvisoContratistaDependencia(this.contratistaForm.value).subscribe({
        next: (response) => {
          console.log('Aviso de contratista (dependencia) guardado:', response);
          this.dialogRef.close(true);
        },
        error: (error) => console.error('Error al guardar aviso de contratista (dependencia):', error)
      });
    }
  }

  guardar(): void {
    if (this.formularioActivo === 'contratista') this.guardarContratista();
    else this.guardarAviso();
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
