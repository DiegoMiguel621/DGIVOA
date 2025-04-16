import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Visita {
  id: number;
  fecha: string;
  tipo_dependencia: string;
  municipio_nombre?: string;
  nombre: string;
  asunto: string;
  observaciones: string;
  telefono: string;
  hora_ingreso: string;
  hora_salida: string;
  atendio: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  private apiUrl = 'http://localhost:3000/api/visitas';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todas las visitas (si se requiere en otro contexto)
  obtenerVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  // 🔹 Registrar hora de salida
  registrarHoraSalida(id: number, hora_salida: string) {
    return this.http.put(`http://localhost:3000/api/visitas/${id}/salida`, { hora_salida });
  }



  // Obtener visitas solo del día actual
obtenerVisitasDelDia(): Observable<Visita[]> {
  return this.http.get<Visita[]>(`${this.apiUrl}`);
}

// Obtener visitas de días anteriores (archivo)
obtenerVisitasArchivo(): Observable<Visita[]> {
  return this.http.get<Visita[]>(`${this.apiUrl}/anteriores`);
}

}
