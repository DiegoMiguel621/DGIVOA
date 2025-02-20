import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:3000/api/empleados'; 


  constructor(private http: HttpClient) {}

  getEmpleados(inactivos: boolean = false): Observable<any[]> {
    const url = inactivos ? `${this.apiUrl}/inactivos` : this.apiUrl;
    return this.http.get<any[]>(url);
  }
  
  restaurarEmpleado(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/restaurar`, {});
  }
  
  agregarEmpleado(empleado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, empleado);
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerEmpleadoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, empleado);
  }

  darDeBajaEmpleado(id_empleado: number) {
    return this.http.put(`${this.apiUrl}/${id_empleado}/baja`, {});
  }
  
}
