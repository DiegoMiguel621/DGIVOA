import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agregar-visitas-modal',
  templateUrl: './agregar-visitas-modal.component.html',
  styleUrl: './agregar-visitas-modal.component.css'
})
export class AgregarVisitasModalComponent implements OnInit {

  visitaForm!: FormGroup;
  mostrarCampoMunicipio: boolean = false;
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];
  empleados: any[] = [];
  empleadosFiltrados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AgregarVisitasModalComponent>
  ) {
    console.log("El modal se ha abierto");
  }

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

    this.obtenerMunicipios();
    this.obtenerEmpleados();
  }

  // Si seleccionan 'Municipio', mostramos el input adicional
  onTipoDependenciaChange(event: any) {
    const valor = event.target.value;
    this.mostrarCampoMunicipio = (valor === 'Municipio');
  }

  // Cargar municipios desde API
  obtenerMunicipios() {
    this.http.get<any[]>('http://localhost:3000/api/municipios').subscribe(data => {
      this.municipios = data;
      this.municipiosFiltrados = data;
    });
  }

  // Autocompletado
  filtrarMunicipios() {
    const texto = this.visitaForm.get('municipio_nombre')?.value?.toLowerCase() || '';
    this.municipiosFiltrados = this.municipios.filter(m =>
      m.nombre.toLowerCase().includes(texto)
    );
  }

  // Cargar empleados activos
  obtenerEmpleados() {
    this.http.get<any[]>('http://localhost:3000/api/empleados').subscribe(data => {
      this.empleados = data;
      this.empleadosFiltrados = data; // inicia con todos
    });
  }


  filtrarEmpleados() {
    const texto = this.visitaForm.get('atendio')?.value?.toLowerCase() || '';
    this.empleadosFiltrados = this.empleados.filter(emp =>
      (emp.nombres + ' ' + emp.apellidos).toLowerCase().includes(texto)
    );
  }


  // Guardar visita
  guardarVisita(): void {
    if (this.visitaForm.invalid) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    const datos = {
      fecha: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      tipo_dependencia: this.visitaForm.value.tipo_dependencia,
      municipio_nombre: this.visitaForm.value.municipio_nombre || null,
      nombre: this.visitaForm.value.nombre,
      asunto: this.visitaForm.value.asunto,
      observaciones: this.visitaForm.value.observaciones,
      telefono: this.visitaForm.value.telefono,
      atendio: this.visitaForm.value.atendio,
      hora_salida: null // por ahora, null
    };

    this.http.post('http://localhost:3000/api/visitas', datos).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error("Error al guardar visita", error);
      }
    });

  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
