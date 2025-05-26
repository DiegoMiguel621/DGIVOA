import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conversacion',
  templateUrl: './conversacion.component.html',
  styleUrls: ['./conversacion.component.css']
})
export class ConversacionComponent implements OnInit {
  @Input() usuarioActual: any;
  @Input() receptor: any;
  @Output() volver = new EventEmitter<void>();

    mensajes: any[] = [];
    nuevoMensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // aquí pronto cargaremos los mensajes entre usuarioActual y receptor
    console.log('Usuario actual:', this.usuarioActual);
    console.log('Receptor seleccionado:', this.receptor);
    this.cargarMensajes();
  }


  cargarMensajes() {
    const url = `http://localhost:3000/api/mensajes/${this.usuarioActual.id_empleado}/${this.receptor.id_empleado}`;
    this.http.get<any[]>(url).subscribe(data => {
      this.mensajes = data;
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const nuevo = {
      emisor_id: this.usuarioActual.id_empleado,
      receptor_id: this.receptor.id_empleado,
      mensaje: this.nuevoMensaje
    };

    this.http.post('http://localhost:3000/api/mensajes', nuevo).subscribe(() => {
      this.nuevoMensaje = '';
      this.cargarMensajes(); // Recarga los mensajes
    });
  }

  getFoto(nombreFoto: string): string {
    return nombreFoto && nombreFoto !== 'user-default.png'
      ? `http://localhost:3000/uploads/${nombreFoto}`
      : 'assets/images/user-default.png';
  }


  cerrarVentana() {
    this.volver.emit();
  }
}
