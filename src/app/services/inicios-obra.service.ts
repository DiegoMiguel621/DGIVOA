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

  obtenerAvisosMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMunicipios);
  }

  obtenerAvisosDependencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDependencias);
  }
}
