import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Municipio {
  clave: string;
  nombre: string;
}

export interface Localidad {
  clave: string;
  nombre: string;
  claveMunicipio: string;
}

@Injectable({
  providedIn: 'root'
})
export class IniciosObraService {
  private apiUrlMunicipios = 'http://localhost:3000/api/avisos-municipios';
  private apiUrlDependencias = 'http://localhost:3000/api/avisos-dependencias';
  private apiUrlMunicipiosContratista = 'http://localhost:3000/api/avisos-municipios-contratista';
  private apiUrlDependenciasContratista = 'http://localhost:3000/api/avisos-dependencias-contratista';

  private apiUrlCatalogoMunicipios = 'http://localhost:3000/api/municipios';
  private apiUrlLocalidades = 'http://localhost:3000/api/localidades';

  

  constructor(private http: HttpClient) {}

  //Funciones para avisos de inicio de MUNICIPIOS
  obtenerAvisosMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMunicipios);
  }
  agregarAvisoMunicipio(aviso: any): Observable<any> {
    return this.http.post<any>(this.apiUrlMunicipios, aviso);
  }
  guardarAvisoContratistaMunicipio(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlMunicipiosContratista}`, data);
  }


  //Funciones para avisos de inicio de DEPENDENCIAS
  obtenerAvisosDependencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDependencias);
  }
  agregarAvisoDependencia(aviso: any): Observable<any> {
    return this.http.post(this.apiUrlDependencias, aviso);
  }
  guardarAvisoContratistaDependencia(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlDependenciasContratista}`, data);
  }
  getConsecutivoDependencia(anio: string, claveMunicipio: string, fondo: string) {
    return this.http.get<any>('http://localhost:3000/api/obras-dependencias/consecutivo', {
      params: { anio, claveMunicipio, fondo }
    });
  }


  
// Municipios (clave, nombre)
  obtenerCatalogoMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlCatalogoMunicipios);
  }

  // Localidades: si se envía claveMunicipio filtra; si no, devuelve todas
  obtenerLocalidades(claveMunicipio?: string): Observable<any[]> {
    if (claveMunicipio) {
      return this.http.get<any[]>(this.apiUrlLocalidades, {
        params: { claveMunicipio }
      });
    }
    return this.http.get<any[]>(this.apiUrlLocalidades);
  }

getConsecutivo(anio: string, claveMunicipio: string, fondo: string) {
  return this.http.get<any>(`http://localhost:3000/api/obras-municipios/consecutivo`, {
    params: {
      anio,
      claveMunicipio,
      fondo
    }
  });
}


}
