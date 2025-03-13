import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IniciosObraService {
  private apiUrlMunicipios = 'http://localhost:3000/api/avisos-municipios'; 
  private apiUrlDependencias = 'http://localhost:3000/api/avisos-dependencias';

  constructor(private http: HttpClient) {}

  //Funciones para avisos de inicio de MUNICIPIOS
  obtenerAvisosMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMunicipios);
  }
  agregarAvisoMunicipio(aviso: any): Observable<any> {
    return this.http.post<any>(this.apiUrlMunicipios, aviso);
  }
 

  //Funciones para avisos de inicio de DEPENDENCIAS
  obtenerAvisosDependencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDependencias);
  }
  agregarAvisoDependencia(aviso: any): Observable<any> {
    return this.http.post(this.apiUrlDependencias, aviso);
  }
}
