import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuario: any;
  fotoPerfil: string = 'assets/images/user-default.png';
  mostrarChat: boolean = false;
  empleadoSeleccionado: any = null;
  usuarioActual: any;
  totalNoLeidos: number = 0;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.usuarioActual = usuario;
        this.totalNoLeidos = 0;

        this.fotoPerfil = usuario.foto?.startsWith('http')
          ? usuario.foto
          : `http://localhost:3000/uploads/${usuario.foto}`;

        this.contarNoLeidos();
      }
    });
  }

  abrirConversacion(empleado: any) {
    this.empleadoSeleccionado = empleado;
    this.marcarComoLeidos(); // Marca mensajes como leídos
  }

  cerrarConversacion() {
    this.empleadoSeleccionado = null;
  }

  toggleChat() {
    this.mostrarChat = !this.mostrarChat;
  }

contarNoLeidos() {
  this.http.get<any>(`http://localhost:3000/api/mensajes/no-leidos/${this.usuarioActual.id_empleado}`)
    .subscribe(data => {
      console.log('🔁 total no leídos:', data.total); // 👈 asegúrate que aparece en consola
      this.totalNoLeidos = data.total;
    }, error => {
      console.error('❌ Error al obtener mensajes no leídos:', error);
    });
}


  marcarComoLeidos() {
    if (!this.empleadoSeleccionado) return;

    this.http.put('http://localhost:3000/api/mensajes/marcar-leidos', {
      emisor_id: this.empleadoSeleccionado.id_empleado,
      receptor_id: this.usuarioActual.id_empleado
    }).subscribe(() => {
      this.totalNoLeidos = 0;
    });
  }

  actualizarResumenChats() {
  this.http.get<any[]>(`http://localhost:3000/api/conversaciones-resumen/${this.usuarioActual.id_empleado}`)
    .subscribe((convs) => {
      const chatSidebar = document.querySelector('app-chat-sidebar') as any;
      if (chatSidebar?.componentInstance) {
        chatSidebar.componentInstance.actualizarChatsExternamente(convs);
      }
    });
}

}
