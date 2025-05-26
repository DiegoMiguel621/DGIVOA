import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

ngOnInit(): void {
  this.authService.usuario$.subscribe(usuario => {
    if (usuario) {
      this.usuario = usuario;
      this.usuarioActual = usuario; // ✅ Guarda también como usuarioActual

      this.fotoPerfil = usuario.foto?.startsWith('http')
        ? usuario.foto
        : `http://localhost:3000/uploads/${usuario.foto}`;
        this.contarNoLeidos();
    }
  });
}


  abrirConversacion(empleado: any) {
  this.empleadoSeleccionado = empleado;
}

cerrarConversacion() {
  this.empleadoSeleccionado = null;
}

  toggleChat() {
  this.mostrarChat = !this.mostrarChat;
}

contarNoLeidos() {
  fetch(`http://localhost:3000/api/mensajes/no-leidos/${this.usuarioActual.id_empleado}`)
    .then(res => res.json())
    .then(data => this.totalNoLeidos = data.total);
}

}
