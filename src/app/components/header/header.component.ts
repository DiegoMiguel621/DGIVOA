import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuario: any;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      console.log("Usuario en Header:", usuario); // 👀 Verifica si recibe datos
      this.cdr.detectChanges(); // 🔄 Fuerza la actualización del header
    });
  }
}
