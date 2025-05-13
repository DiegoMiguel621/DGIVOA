import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InspeccionesService {
  private apiMunicipios = '/api/avisos-municipios';
  private apiDependencias = '/api/avisos-dependencias';

  constructor(private http: HttpClient) {}

  obtenerTodasLasObras(): Observable<any[]> {
    const municipios$ = this.http.get<any[]>(this.apiMunicipios);
    const dependencias$ = this.http.get<any[]>(this.apiDependencias);

    return forkJoin([municipios$, dependencias$]).pipe(
      map(([muni, depen]) => [...muni, ...depen])
    );
  }
}
