import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EmpleadosService } from '../../services/empleados.service';
import { MatDialog } from '@angular/material/dialog';

import { AgregarEmpleadosModalComponent } from '../../modals/agregar-empleados-modal/agregar-empleados-modal.component';
import { EditarEmpleadosModalComponent } from '../../modals/editar-empleados-modal/editar-empleados-modal.component';
import { EliminarEmpleadoModalComponent } from '../../modals/eliminar-empleado-modal/eliminar-empleado-modal.component';
import { RestaurarEmpleadoModalComponent } from '../../modals/restaurar-empleado-modal/restaurar-empleado-modal.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  isAsideCollapsed = false;
  empleados: any[] = []; // Lista completa de empleados
  empleadosFiltrados: any[] = []; // Lista después de aplicar filtros
  empleadosPaginados: any[] = []; // Lista paginada
  mostrandoInactivos = false;
  paginaActual = 1;
  empleadosPorPagina = 9;
  totalPaginas = 1;

  filtroNombre: string = '';
  filtroDireccion: string = 'TODOS'; // Predeterminado

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private empleadosService: EmpleadosService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {  
    this.obtenerEmpleados(); 
    
    if (isPlatformBrowser(this.platformId)) {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isAsideCollapsed = (collapsedFromStorage === 'true');
      }
    }    
  }

  onAsideToggled(collapsed: boolean): void {
    this.isAsideCollapsed = collapsed;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('asideCollapsed', collapsed.toString());
    }
  }

  obtenerEmpleados(): void {
    this.empleadosService.getEmpleados(this.mostrandoInactivos).subscribe(
      (data) => {
        this.empleados = data;
        this.paginaActual = 1;
        this.filtrarEmpleados(); // Aplicar los filtros después de obtener los datos
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }
  

  alternarEmpleados(): void {
    this.mostrandoInactivos = !this.mostrandoInactivos;
    this.obtenerEmpleados();
    this.filtroDireccion = 'TODOS';
    this.filtroNombre = '';
  }

  agregarEmpleado(): void {
    const dialogRef = this.matDialog.open(AgregarEmpleadosModalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) { 
        this.obtenerEmpleados();
        this.filtroDireccion = 'TODOS';
        this.filtroNombre = '';
      } 
    });
  }

  editarEmpleado(id_empleado: number): void {
    this.empleadosService.obtenerEmpleadoPorId(id_empleado).subscribe(empleado => {
      const dialogRef = this.matDialog.open(EditarEmpleadosModalComponent, {
        width: '400px',
        data: empleado
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.obtenerEmpleados();
          this.filtroDireccion = 'TODOS';
          this.filtroNombre = '';
        }
      });
    });
  }

  eliminarEmpleado(id_empleado: number): void {
    const dialogRef = this.matDialog.open(EliminarEmpleadoModalComponent, {
      data: { id_empleado }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerEmpleados();
        this.filtroDireccion = 'TODOS';
        this.filtroNombre = '';
      }
    });
  }

  restaurarEmpleado(id_empleado: number): void {
    const dialogRef = this.matDialog.open(RestaurarEmpleadoModalComponent, {
      data: { id_empleado }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerEmpleados();
        this.filtroDireccion = 'TODOS';
        this.filtroNombre = '';
      }
    });
  }

  // 🔎 Filtrar empleados según el input de búsqueda y la dirección seleccionada
  filtrarEmpleados(): void {
    let filtrados = this.empleados;

    // Filtrar por nombre o apellido si hay algo escrito en el input (Ignorar mayúsculas/minúsculas)
    if (this.filtroNombre.trim() !== '') {
      const nombreBuscado = this.filtroNombre.toLowerCase();
      filtrados = filtrados.filter(emp =>
        emp.nombres.toLowerCase().includes(nombreBuscado) ||
        emp.apellidos.toLowerCase().includes(nombreBuscado)
      );
    }

    // Filtrar por dirección si no está en 'TODOS'
    if (this.filtroDireccion !== 'TODOS') {
      filtrados = filtrados.filter(emp => emp.direccion === this.filtroDireccion);
    }

    this.empleadosFiltrados = filtrados;
    this.paginarEmpleados();
  }

  // 🔄 Paginación de empleados
  paginarEmpleados(): void {
    const inicio = (this.paginaActual - 1) * this.empleadosPorPagina;
    const fin = inicio + this.empleadosPorPagina;
    this.empleadosPaginados = this.empleadosFiltrados.slice(inicio, fin);
    this.totalPaginas = Math.ceil(this.empleadosFiltrados.length / this.empleadosPorPagina);
  }

  // 🔁 Cambiar página en la tabla
  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.paginarEmpleados();
    }
  }

  // 📌 Filtrar por dirección y actualizar la opción activa
  filtrarPorDireccion(direccion: string): void {
    this.filtroDireccion = direccion;    
    this.filtroNombre = '';
    this.paginaActual = 1;
    this.filtrarEmpleados();
  }

  // 📌 Filtrar por nombre
  actualizarFiltroNombre(event: any): void {
    this.filtroNombre = event.target.value;
    this.paginaActual = 1;
    this.filtrarEmpleados();
  }
  
}
