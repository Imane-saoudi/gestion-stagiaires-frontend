import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Stagiaire } from '../../../core/models/stagiaire.model';
import { HistoriqueStatut } from '../../../core/models/historique-statut.model';
import { DocumentStagiaire } from '../../../core/models/document.model';
import { StagiaireService } from '../../../core/services/stagiaire.service';
import { DocumentService } from '../../../core/services/document.service';
import { DocumentUploadComponent } from '../../documents/document-upload/document-upload.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-stagiaire-detail',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, DocumentUploadComponent, StatusBadgeComponent],
  templateUrl: './stagiaire-detail.component.html',
  styleUrl: './stagiaire-detail.component.css'
})
export class StagiaireDetailComponent implements OnInit {
  stagiaire: Stagiaire | null = null;
  historique: HistoriqueStatut[] = [];
  documents: DocumentStagiaire[] = [];
  stagiaireId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stagiaireService: StagiaireService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.stagiaireId = +this.route.snapshot.paramMap.get('id')!;
    this.charger();
  }

  charger(): void {
    this.stagiaireService.getById(this.stagiaireId).subscribe({
      next: (s) => (this.stagiaire = s),
      error: (err) => console.error('Erreur chargement stagiaire', err)
    });

    this.stagiaireService.getHistorique(this.stagiaireId).subscribe({
      next: (h) => (this.historique = h),
      error: (err) => console.error('Erreur chargement historique', err)
    });

    this.documentService.getByStagiaire(this.stagiaireId).subscribe({
      next: (d) => (this.documents = d),
      error: (err) => console.error('Erreur chargement documents', err)
    });
  }

  telecharger(doc: DocumentStagiaire): void {
    if (!doc.id) return;
    this.documentService.telecharger(doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.nomFichier;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Erreur téléchargement document', err)
    });
  }

  consulter(doc: DocumentStagiaire): void {
    if (!doc.id) return;
    this.documentService.telecharger(doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => console.error('Erreur consultation document', err)
    });
  }

  supprimerDocument(doc: DocumentStagiaire): void {
    if (!doc.id) return;
    if (confirm(`Supprimer le document "${doc.type}" ?`)) {
      this.documentService.delete(doc.id).subscribe({
        next: () => this.charger(),
        error: (err) => console.error('Erreur suppression document', err)
      });
    }
  }

  modifier(): void {
    this.router.navigate(['/stagiaires', this.stagiaireId, 'modifier']);
  }

  retour(): void {
    this.router.navigate(['/stagiaires']);
  }
}
