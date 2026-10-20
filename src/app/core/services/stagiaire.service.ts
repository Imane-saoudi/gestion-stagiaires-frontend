import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stagiaire } from '../models/stagiaire.model';
import { HistoriqueStatut } from '../models/historique-statut.model';

@Injectable({ providedIn: 'root' })
export class StagiaireService {
  private baseUrl = `${environment.apiUrl}/stagiaires`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stagiaire[]> {
    return this.http.get<Stagiaire[]>(this.baseUrl);
  }

  getById(id: number): Observable<Stagiaire> {
    return this.http.get<Stagiaire>(`${this.baseUrl}/${id}`);
  }

  create(stagiaire: Stagiaire): Observable<Stagiaire> {
    return this.http.post<Stagiaire>(this.baseUrl, stagiaire);
  }

  update(id: number, stagiaire: Stagiaire): Observable<Stagiaire> {
    return this.http.put<Stagiaire>(`${this.baseUrl}/${id}`, stagiaire);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(criteres: any): Observable<Stagiaire[]> {
    let params = new HttpParams();
    Object.keys(criteres).forEach((key) => {
      if (criteres[key]) {
        params = params.set(key, criteres[key]);
      }
    });
    return this.http.get<Stagiaire[]>(`${this.baseUrl}/recherche`, { params });
  }

  updateStatut(id: number, statut: string): Observable<Stagiaire> {
    return this.http.patch<Stagiaire>(`${this.baseUrl}/${id}/statut`, { statut });
  }

  getHistorique(id: number): Observable<HistoriqueStatut[]> {
    return this.http.get<HistoriqueStatut[]>(`${this.baseUrl}/${id}/historique`);
  }

  checkCinUnique(cin: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('cin', cin);
    if (excludeId) params = params.set('excludeId', excludeId.toString());
    return this.http.get<boolean>(`${this.baseUrl}/verifier-cin`, { params });
  }
}
