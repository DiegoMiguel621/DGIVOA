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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.fotoPerfil = usuario.foto?.startsWith('http')
          ? usuario.foto
          : `http://localhost:3000/uploads/${usuario.foto}`;
      }
    });
  }

  toggleChat() {
  this.mostrarChat = !this.mostrarChat;
}

}
