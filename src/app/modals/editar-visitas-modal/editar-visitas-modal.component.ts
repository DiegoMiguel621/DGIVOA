import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-editar-visita-modal',
  templateUrl: './editar-visitas-modal.component.html',
  styleUrl: './editar-visitas-modal.component.css'
})
export class EditarVisitasModalComponent implements OnInit {

  visitaForm!: FormGroup;
  mostrarCampoMunicipio: boolean = false;
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];
  empleados: any[] = [];
  empleadosFiltrados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditarVisitasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.visitaForm = this.fb.group({
      tipo_dependencia: ['', Validators.required],
      municipio_nombre: [''],
      nombre: ['', Validators.required],
      asunto: ['', Validators.required],
      observaciones: [''],
      telefono: [''],
      atendio: ['', Validators.required]
    });

    // 👇 Aquí llenamos el formulario con los datos recibidos
    this.visitaForm.patchValue({
      tipo_dependencia: this.data.tipo_dependencia,
      municipio_nombre: this.data.municipio_nombre,
      nombre: this.data.nombre,
      asunto: this.data.asunto,
      observaciones: this.data.observaciones,
      telefono: this.data.telefono,
      atendio: this.data.atendio
    });

    // Mostrar campo municipio si aplica
    if (this.data.tipo_dependencia === 'Municipio') {
      this.mostrarCampoMunicipio = true;
    }

    // 👇 Cargar listas
    this.obtenerMunicipios();
    this.obtenerEmpleados();
  }


  onTipoDependenciaChange(event: any) {
    const valor = event.target.value;
    this.mostrarCampoMunicipio = (valor === 'Municipio');
  }

  obtenerMunicipios() {
    this.http.get<any[]>('http://localhost:3000/api/municipios').subscribe(data => {
      this.municipios = data;
      this.municipiosFiltrados = data;
    });
  }

  filtrarMunicipios() {
    const texto = this.visitaForm.get('municipio_nombre')?.value?.toLowerCase() || '';
    this.municipiosFiltrados = this.municipios.filter(m =>
      m.nombre.toLowerCase().includes(texto)
    );
  }

  obtenerEmpleados() {
    this.http.get<any[]>('http://localhost:3000/api/empleados').subscribe(data => {
      this.empleados = data;
      this.empleadosFiltrados = data;
    });
  }

  filtrarEmpleados() {
    const texto = this.visitaForm.get('atendio')?.value?.toLowerCase() || '';
    this.empleadosFiltrados = this.empleados.filter(emp =>
      (emp.nombres + ' ' + emp.apellidos).toLowerCase().includes(texto)
    );
  }

  actualizarVisita(): void {
    if (this.visitaForm.invalid) return;

    const datosActualizados = this.visitaForm.value;

    this.http.put(`http://localhost:3000/api/visitas/${this.data.id}`, datosActualizados)
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: err => console.error('Error al actualizar visita', err)
      });
  }


  cerrarModal(): void {
    this.dialogRef.close();
  }
}
