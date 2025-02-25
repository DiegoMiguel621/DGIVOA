import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && sessionStorage) {
      this.cargarSesion(); // Cargar sesión solo si sessionStorage está disponible
    }
  }

  iniciarSesion(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }

  guardarSesion(usuario: any): void {
    if (typeof window !== 'undefined' && sessionStorage) {
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }
    this.usuarioSubject.next(usuario);
  }

  obtenerUsuario(): any {
    return this.usuarioSubject.value;
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
    this.usuarioSubject.next(null);
    console.log("Sesión cerrada correctamente.");
  }
  actualizarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario)); // Guardar en localStorage
  }
  
}
