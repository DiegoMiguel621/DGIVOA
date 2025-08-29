import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService, Localidad } from '../../services/inicios-obra.service'; // <-- usa la interfaz Localidad
import { MunicipiosService } from '../../services/municipios.service';

@Component({
  selector: 'app-agregar-inicio-municipio-modal',
  templateUrl: './agregar-inicio-municipio-modal.component.html',
  styleUrls: ['./agregar-inicio-municipio-modal.component.css'] // (mini fix si quieres)
})
export class AgregarInicioMunicipioModalComponent {
  formularioActivo: string = 'municipio';
  avisoForm: FormGroup;
  contratistaForm: FormGroup;

  municipios: any[] = [];
  localidades: Localidad[] = []; // <-- NUEVO

  // NUEVO: flags para controlar autogeneración
  claveObraManual = false;
  private settingClaveProgrammatically = false;


  constructor(
    private fb: FormBuilder,
    private iniciosObraService: IniciosObraService,
    private municipiosService: MunicipiosService,
    private dialogRef: MatDialogRef<AgregarInicioMunicipioModalComponent>
  ) {
    this.avisoForm = this.fb.group({
      noFolio: ['', Validators.required],
      nomDirigido: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaRecibo: ['', Validators.required],
      observaciones: [''],
      cumpleAviso: ['SI', Validators.required],
      nombreObra: ['', Validators.required],
      municipio: ['', Validators.required],   // guarda la CLAVE del municipio
      localidad: ['', Validators.required],   // guardará el NOMBRE de la localidad
      claveObra: ['', Validators.required],
      tipoRecurso: ['FEDERAL', Validators.required],
      fondo: [''],
      montoAutorizado: [''],
      montoContratado: [''],
      numContrato: [''],
      fechaInicio: [''],
      fechaTermino: [''],
      contratista: ['']
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
    this.municipiosService.getMunicipios().subscribe(
      (data) => {
        this.municipios = data;

        // Listeners existentes
        this.avisoForm.get('fechaInicio')?.valueChanges.subscribe(() => this.generarClaveObra());
        this.avisoForm.get('fondo')?.valueChanges.subscribe(() => this.generarClaveObra());
        this.avisoForm.get('municipio')?.valueChanges.subscribe((claveMunicipio: string) => {
          this.cargarLocalidadesPorMunicipio(claveMunicipio);
          this.avisoForm.get('localidad')?.setValue('');
          this.generarClaveObra();
        });

        // NUEVO: si el usuario edita "claveObra", activamos modo manual
        this.avisoForm.get('claveObra')?.valueChanges.subscribe(() => {
          if (!this.settingClaveProgrammatically) {
            this.claveObraManual = true;
          }
        });
      },
      (error) => {
        console.error('Error cargando municipios', error);
      }
    );
  }


  // === NUEVO: cargar localidades para un municipio ===
  private cargarLocalidadesPorMunicipio(claveMunicipio: string): void {
    if (!claveMunicipio) {
      this.localidades = [];
      return;
    }
    this.iniciosObraService.obtenerLocalidades(claveMunicipio).subscribe({
      next: (locs) => this.localidades = locs,
      error: (e) => console.error('Error cargando localidades:', e)
    });
  }

  guardarAviso(): void {
    if (this.avisoForm.valid) {
      this.iniciosObraService.agregarAvisoMunicipio(this.avisoForm.value).subscribe(
        (response) => {
          console.log('Aviso de inicio registrado:', response);
          this.dialogRef.close(true);
        },
        (error) => console.error('Error al registrar el aviso:', error)
      );
    } else {
      console.log('Formulario no válido, revisa los campos.');
    }
  }

  guardarContratista() {
    if (this.contratistaForm.valid) {
      this.iniciosObraService.guardarAvisoContratistaMunicipio(this.contratistaForm.value).subscribe(
        (response) => {
          console.log('Aviso de contratista (municipio) guardado:', response);
          this.dialogRef.close(true);
        },
        (error) => console.error('Error al guardar aviso de contratista (municipio):', error)
      );
    }
  }

  guardar(): void {
    if (this.formularioActivo === 'contratista') {
      this.guardarContratista();
    } else {
      this.guardarAviso();
    }
  }

  generarClaveObra() {
    // Si el usuario la modificó manualmente, no auto-sobrescribir
    if (this.claveObraManual) return;

    const fechaInicio = this.avisoForm.get('fechaInicio')?.value;
    const fondo = this.avisoForm.get('fondo')?.value;
    const claveMunicipio = this.avisoForm.get('municipio')?.value;

    if (!fechaInicio || !fondo || !claveMunicipio) return;

    const anio = new Date(fechaInicio).getFullYear().toString();
    const claveFormateada = String(claveMunicipio).padStart(3, '0');

    this.iniciosObraService.getConsecutivo(anio, claveFormateada, fondo).subscribe(
      (data) => {
        const consecutivo = String(data.consecutivo).padStart(3, '0');
        const claveGenerada = `${anio}/${fondo}${claveFormateada}${consecutivo}`;

        // Marcar que el set es programático para no activar el modo manual
        this.settingClaveProgrammatically = true;
        this.avisoForm.get('claveObra')?.setValue(claveGenerada);
        this.settingClaveProgrammatically = false;
      },
      (error) => {
        console.error('Error generando clave:', error);
      }
    );
  }

  recalcularClaveObra(): void {
    this.claveObraManual = false;       // desactiva modo manual
    this.generarClaveObra();            // recalcula y llena automáticamente
  }



  cerrarModal(): void {
    this.dialogRef.close();
  }
}
