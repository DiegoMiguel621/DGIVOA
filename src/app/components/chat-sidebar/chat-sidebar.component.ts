import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent implements OnInit {
  empleados: any[] = [];
  usuarioActual: any;
  terminoBusqueda: string = '';
  chats: any[] = [];

  @Output() cerrar = new EventEmitter<void>();

constructor(
  private empleadosService: EmpleadosService,
  private authService: AuthService,
  private http: HttpClient  // ✅ ¡Falta esto!
) {}

ngOnInit(): void {
  this.authService.usuario$.subscribe(usuario => {
    if (usuario) {
      this.usuarioActual = usuario;

      // 1. Carga los empleados activos
      this.empleadosService.getEmpleadosActivos().subscribe(empleados => {
        // 2. Filtra el usuario actual para no incluirlo
        this.empleados = empleados.filter(emp => emp.id_empleado !== usuario.id_empleado);

        // 3. Trae los chats resumidos
        this.http.get<any[]>(`http://localhost:3000/api/conversaciones-resumen/${usuario.id_empleado}`)
          .subscribe(chatsResumen => {
            // 4. Mapea empleados + chats
this.chats = this.empleados.map(emp => {
  const chat = chatsResumen.find(c => c.id_empleado === emp.id_empleado);
  return {
    ...emp,
    mensaje: chat?.mensaje || 'Haz clic para comenzar...',
    fecha_envio: chat?.fecha_envio || null,
    no_leidos: chat?.no_leidos || 0
  };
});


            // 5. Ordenar por fecha de mensaje (los sin mensajes al final)
            this.chats.sort((a, b) => {
              const fechaA = a.fecha_envio ? new Date(a.fecha_envio).getTime() : 0;
              const fechaB = b.fecha_envio ? new Date(b.fecha_envio).getTime() : 0;
              return fechaB - fechaA;
            });
          });
      });
    }
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

@Output() abrirConversacion = new EventEmitter<any>();

seleccionarEmpleado(empleado: any) {
  this.abrirConversacion.emit(empleado);
}


actualizarChatsExternamente(resumen: any[]) {
  this.chats = resumen.sort(
    (a, b) => new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
  );
}




  cerrarChat(): void {
    this.cerrar.emit();
  }
}
