import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {
  private apiUrl = 'http://localhost:3000/api/municipios';

  constructor(private http: HttpClient) {}

  getMunicipios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
