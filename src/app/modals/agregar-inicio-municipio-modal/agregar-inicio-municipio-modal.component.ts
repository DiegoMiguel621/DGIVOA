import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IniciosObraService } from '../../services/inicios-obra.service';
import { MunicipiosService } from '../../services/municipios.service';


@Component({
  selector: 'app-agregar-inicio-municipio-modal',
  templateUrl: './agregar-inicio-municipio-modal.component.html',
  styleUrl: './agregar-inicio-municipio-modal.component.css'
})
export class AgregarInicioMunicipioModalComponent {
  formularioActivo: string = 'municipio';
  avisoForm: FormGroup;
  contratistaForm: FormGroup;
  municipios: any[] = [];


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
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
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
    console.log(`Cambiando a formulario: ${tipo}`); // Debug
    this.formularioActivo = tipo;
  }


  guardarAviso(): void {
    if (this.avisoForm.valid) {
      this.iniciosObraService.agregarAvisoMunicipio(this.avisoForm.value).subscribe(
        response => {
          console.log('Aviso de inicio registrado:', response);
          this.dialogRef.close(true); // Cerrar modal y actualizar tabla
        },
        error => {
          console.error('Error al registrar el aviso:', error);
        }
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
        (error) => {
          console.error('Error al guardar aviso de contratista (municipio):', error);
        }
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

ngOnInit(): void {
  this.municipiosService.getMunicipios().subscribe(
  (data) => {
    console.log('📥 Municipios recibidos del backend:', data); // 👈 Asegura que incluya clave
    this.municipios = data;


    if (data.length) {
      console.log('🧪 Primer municipio:', data[0]);
    }

    // Activar listeners una vez que municipios esté cargado
this.avisoForm.get('fechaInicio')?.valueChanges.subscribe(() => this.generarClaveObra());
this.avisoForm.get('fondo')?.valueChanges.subscribe(() => this.generarClaveObra());
this.avisoForm.get('municipio')?.valueChanges.subscribe(() => this.generarClaveObra());

  },
  (error) => {
    console.error('Error cargando municipios', error);
  }
);
}



generarClaveObra() {
  const fechaInicio = this.avisoForm.get('fechaInicio')?.value;
  const fondo = this.avisoForm.get('fondo')?.value;
  const claveMunicipio = this.avisoForm.get('municipio')?.value; // ahora contiene la clave directamente


  console.log('🟨 VALORES DEL FORMULARIO:');
  console.log('📆 Fecha inicio:', fechaInicio);
  console.log('🏛️ Fondo:', fondo);
  console.log('🏷️ Municipio seleccionado (clave):', claveMunicipio);

  if (!fechaInicio || !fondo || !claveMunicipio) {
    console.warn('❗ Faltan datos para generar la clave');
    return;
  }

  const anio = new Date(fechaInicio).getFullYear().toString();

  const municipio = this.municipios.find(m => m.clave === claveMunicipio);
  if (!municipio) {
    console.error('🚨 No se encontró municipio con clave:', claveMunicipio);
    return;
  }

  const claveFormateada = claveMunicipio.padStart(3, '0');

  this.iniciosObraService.getConsecutivo(anio, claveFormateada, fondo).subscribe(
    (data) => {
      const consecutivo = data.consecutivo.toString().padStart(3, '0');
      const claveGenerada = `${anio}/${fondo}${claveFormateada}${consecutivo}`;
      this.avisoForm.get('claveObra')?.setValue(claveGenerada);
    },
    (error) => {
      console.error('Error generando clave:', error);
    }
  );
}








  cerrarModal(): void {
    this.dialogRef.close();
  }
}
