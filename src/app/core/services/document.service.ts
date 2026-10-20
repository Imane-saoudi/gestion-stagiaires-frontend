import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentStagiaire } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private baseUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getByStagiaire(stagiaireId: number): Observable<DocumentStagiaire[]> {
    return this.http.get<DocumentStagiaire[]>(`${this.baseUrl}/stagiaire/${stagiaireId}`);
  }

  upload(stagiaireId: number, type: string, file: File): Observable<DocumentStagiaire> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('stagiaireId', stagiaireId.toString());
    return this.http.post<DocumentStagiaire>(`${this.baseUrl}/upload`, formData);
  }

  telecharger(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/telecharger`, { responseType: 'blob' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
