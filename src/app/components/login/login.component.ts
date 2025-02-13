import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Verifica si los campos están vacíos antes de hacer la solicitud
    if (!this.correo || !this.contrasena) {
      alert('Debe llenar todos los campos para el acceso');
      return;
    }

    // Llamada a la API para autenticar
    this.authService.iniciarSesion({ correo: this.correo, contrasena: this.contrasena }).subscribe(
      response => {
        console.log('Respuesta de la API:', response);
        
        if (response.success) {
          this.authService.guardarSesion(response.usuario); // Guarda la sesión
          this.router.navigate(['/inicio']); // Redirige al usuario
        }
      },
      error => {
        if (error.status === 401) {
          alert('Correo o contraseña incorrectos');
          this.correo = '';
          this.contrasena = '';
        } else {
          console.error('Error en la autenticación:', error);
          alert('Error en el servidor, intente de nuevo');
        }
      }
    );
  }
}
