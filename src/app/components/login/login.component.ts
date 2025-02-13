import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  login() {
    // ✅ 1. Validar si los campos están vacíos
    if (!this.correo || !this.contrasena) {
      alert('Debe llenar todos los campos para el acceso');
      return;
    }

    // ✅ 2. Petición a la API
    this.http.post('http://localhost:3000/api/login', { correo: this.correo, contrasena: this.contrasena })
      .subscribe({
        next: (response: any) => {
          console.log("Respuesta de la API:", response);

          // ✅ 3. Si la autenticación es correcta, guardar usuario y redirigir
          if (response && response.success && response.usuario) {
            console.log("Usuario autenticado:", response.usuario);
            this.authService.setUsuario(response.usuario);
            this.router.navigate(['/inicio']); // ✅ Redirige sin alertas
          } else {
            this.mostrarAlertaIncorrectos(); // ✅ Mensaje de error sin errores en consola
          }
        },
        error: error => {
          if (error.status === 401) { // 401 = No autorizado (credenciales incorrectas)
            this.mostrarAlertaIncorrectos();
          } else {
            console.error("Error en la petición:", error);
            alert('Error en el servidor, intente de nuevo');
          }
        }
      });
  }

  mostrarAlertaIncorrectos() {
    alert('Correo o contraseña incorrectos');
    this.correo = '';
    this.contrasena = '';
  }
}
