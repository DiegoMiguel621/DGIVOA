import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuario = new BehaviorSubject<any>(null);
  usuario$ = this.usuario.asObservable();

  setUsuario(usuario: any) {
    console.log("Guardando usuario en AuthService:", usuario); // 👀 Verifica si se guarda correctamente
    this.usuario.next(usuario);
  }

  getUsuario() {
    return this.usuario.value;
  }

  logout() {
    this.usuario.next(null);
  }
}
