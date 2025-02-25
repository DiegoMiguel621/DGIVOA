import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable(); // Observable para suscribirse a cambios
  private apiUrl = 'http://localhost:3000/api/login'; // URL para iniciar sesión

  constructor(private http: HttpClient) {
    this.cargarSesion(); // 🔹 Cargar sesión al iniciar el servicio
  }

  iniciarSesion(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }

  guardarSesion(usuario: any): void {
    if (typeof window !== 'undefined' && sessionStorage) {
        if (usuario.foto && usuario.foto !== 'user-default.png') {
            if (!usuario.foto.includes('http')) {
                usuario.foto = `http://localhost:3000/uploads/${usuario.foto}`;
            }
        } else {
            usuario.foto = 'assets/images/user-default.png';
        }

        sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }
    this.usuarioSubject.next(usuario);
}




  obtenerUsuario(): any {
    return this.usuarioSubject.getValue(); // 🔹 Devuelve el usuario actual
  }

  cargarSesion(): void {
    if (typeof window !== 'undefined' && sessionStorage) {
      const usuarioGuardado = sessionStorage.getItem('usuario');
      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuarioSubject.next(usuario);
      }
    }
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined' && sessionStorage) {
      sessionStorage.removeItem('usuario');
    }
    this.usuarioSubject.next(null); // 🔹 Limpia el usuario en memoria
    console.log("Sesión cerrada correctamente.");
  }

  actualizarUsuario(usuario: any): void {
    sessionStorage.setItem('usuario', JSON.stringify(usuario)); 
    this.usuarioSubject.next(usuario); // 🔥 Notifica a los componentes que el usuario cambió
}


  actualizarFoto(foto: string): void {
    const usuario = this.obtenerUsuario();
    if (usuario) {
      usuario.foto = foto;
      this.actualizarUsuario(usuario); // 🔹 Guarda la nueva foto en la sesión
    }
  }
}
