import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent implements OnInit {
  empleados: any[] = [];
  usuarioActual: any;
  terminoBusqueda: string = '';

  @Output() cerrar = new EventEmitter<void>();

  constructor(
    private empleadosService: EmpleadosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual desde AuthService
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cargarEmpleados();
    });
  }

  cargarEmpleados(): void {
    this.empleadosService.getEmpleadosActivos().subscribe(data => {
      // Filtra al usuario actual para que no se muestre a sí mismo
      this.empleados = data.filter(emp => emp.id_empleado !== this.usuarioActual?.id_empleado);
    });
  }

getFoto(nombreFoto: string): string {
  return nombreFoto && nombreFoto !== 'user-default.png'
    ? `http://localhost:3000/uploads/${nombreFoto}`
    : 'assets/images/user-default.png';
}

get empleadosFiltrados(): any[] {
  const termino = this.terminoBusqueda.toLowerCase();
  return this.empleados.filter(empleado => {
    const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`.toLowerCase();
    return nombreCompleto.includes(termino);
  });
}



  cerrarChat(): void {
    this.cerrar.emit();
  }
}
