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
  private base = 'http://localhost:3000/api';

  // Avisos
  private apiUrlMunicipios               = `${this.base}/avisos-municipios`;
  private apiUrlDependencias             = `${this.base}/avisos-dependencias`;
  private apiUrlMunicipiosContratista    = `${this.base}/avisos-municipios-contratista`;
  private apiUrlDependenciasContratista  = `${this.base}/avisos-dependencias-contratista`;

  // Catálogos
  private apiUrlCatalogoMunicipios = `${this.base}/municipios`;
  private apiUrlLocalidades        = `${this.base}/localidades`;

  constructor(private http: HttpClient) {}

  // ========= LISTADOS =========
  obtenerAvisosMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMunicipios);
  }
  obtenerAvisosDependencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDependencias);
  }

  // ========= ALTA =========
  agregarAvisoMunicipio(aviso: any): Observable<any> {
    return this.http.post<any>(this.apiUrlMunicipios, aviso);
  }
  agregarAvisoDependencia(aviso: any): Observable<any> {
    return this.http.post<any>(this.apiUrlDependencias, aviso);
  }
  guardarAvisoContratistaMunicipio(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrlMunicipiosContratista, data);
  }
  guardarAvisoContratistaDependencia(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrlDependenciasContratista, data);
  }

  // ========= EDICIÓN (Municipios) =========
  /** Obtiene UN aviso (con su obra) por clave de obra */
  obtenerAvisoMunicipioPorClave(claveObra: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlMunicipios}/${encodeURIComponent(claveObra)}`);
  }

  obtenerAvisoContratistaMunicipioPorClave(claveObra: string) {
    return this.http.get<any>(
      `http://localhost:3000/api/avisos-municipios-contratista/${encodeURIComponent(claveObra)}`
    );
  }

  /** Actualiza el aviso/obra. Se envía la clave ORIGINAL en la URL. */
  actualizarAvisoMunicipio(claveObraOriginal: string, aviso: any) {
    return this.http.put<any>(
      `http://localhost:3000/api/avisos-municipios/${encodeURIComponent(claveObraOriginal)}`,
      aviso
    );
  }

  actualizarAvisoContratistaMunicipio(claveObraOriginal: string, data: any) {
    return this.http.put<any>(
      `http://localhost:3000/api/avisos-municipios-contratista/${encodeURIComponent(claveObraOriginal)}`,
      data
    );
  }

  // ========= EDICIÓN (Dependencias) — si luego lo usas =========
  obtenerAvisoDependenciaPorClave(claveObra: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlDependencias}/${encodeURIComponent(claveObra)}`);
  }
  actualizarAvisoDependencia(claveObraOriginal: string, aviso: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrlDependencias}/${encodeURIComponent(claveObraOriginal)}`,
      aviso
    );
  }

  // ========= CATÁLOGOS =========
  obtenerCatalogoMunicipios(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.apiUrlCatalogoMunicipios);
  }

  /** Si se envía claveMunicipio, filtra; si no, devuelve todas (ordenadas por clave en el backend) */
  obtenerLocalidades(claveMunicipio?: string): Observable<Localidad[]> {
    if (claveMunicipio) {
      return this.http.get<Localidad[]>(this.apiUrlLocalidades, { params: { claveMunicipio } });
    }
    return this.http.get<Localidad[]>(this.apiUrlLocalidades);
  }

  // ========= CONSECUTIVOS =========
  getConsecutivo(anio: string, claveMunicipio: string, fondo: string): Observable<any> {
    return this.http.get<any>(`${this.base}/obras-municipios/consecutivo`, {
      params: { anio, claveMunicipio, fondo }
    });
  }

  getConsecutivoDependencia(anio: string, claveMunicipio: string, fondo: string): Observable<any> {
    return this.http.get<any>(`${this.base}/obras-dependencias/consecutivo`, {
      params: { anio, claveMunicipio, fondo }
    });
  }
}
