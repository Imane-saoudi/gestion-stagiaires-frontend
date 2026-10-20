import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Stagiaire } from '../../../core/models/stagiaire.model';
import { StagiaireService } from '../../../core/services/stagiaire.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TypeStage, StatutStage } from '../../../core/models/enums';

@Component({
  selector: 'app-stagiaire-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    StatusBadgeComponent
  ],
  templateUrl: './stagiaire-list.component.html',
  styleUrl: './stagiaire-list.component.css'
})
export class StagiaireListComponent implements OnInit {
  stagiaires: Stagiaire[] = [];
  displayedColumns: string[] = [
    'numeroDossier', 'nom', 'prenom', 'universite', 'filiere', 'typeStage', 'statut', 'actions'
  ];
  criteres: any = {};

  typeStageOptions = Object.values(TypeStage);
  statutOptions = Object.values(StatutStage);

  triCritere = '';
  triDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private stagiaireService: StagiaireService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStagiaires();
  }

  loadStagiaires(): void {
    this.stagiaireService.getAll().subscribe({
      next: (data) => (this.stagiaires = data),
      error: (err) => console.error('Erreur chargement des stagiaires', err)
    });
  }

  rechercher(): void {
    this.stagiaireService.search(this.criteres).subscribe({
      next: (data) => (this.stagiaires = data),
      error: (err) => console.error('Erreur recherche', err)
    });
  }

  reinitialiser(): void {
    this.criteres = {};
    this.triCritere = '';
    this.loadStagiaires();
  }

  // Tri côté client selon le critère choisi (Nom, Date de début, Université, Service, Type de stage, Statut)
  trier(): void {
    if (!this.triCritere) return;

    const cle = this.triCritere;
    this.stagiaires = [...this.stagiaires].sort((a: any, b: any) => {
      let valA = a[cle] ?? '';
      let valB = b[cle] ?? '';

      if (cle === 'dateDebut') {
        valA = new Date(a.dateDebut).getTime();
        valB = new Date(b.dateDebut).getTime();
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return this.triDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.triDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  inverserDirection(): void {
    this.triDirection = this.triDirection === 'asc' ? 'desc' : 'asc';
    this.trier();
  }

  voirDetail(id?: number): void {
    if (id) this.router.navigate(['/stagiaires', id]);
  }

  modifier(id?: number): void {
    if (id) this.router.navigate(['/stagiaires', id, 'modifier']);
  }

  supprimer(id?: number): void {
    if (!id) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { titre: 'Confirmer la suppression', message: 'Voulez-vous vraiment supprimer ce stagiaire ?' }
    });
    ref.afterClosed().subscribe((confirme) => {
      if (confirme) {
        this.stagiaireService.delete(id).subscribe({
          next: () => this.loadStagiaires(),
          error: (err) => console.error('Erreur suppression', err)
        });
      }
    });
  }

  nouveau(): void {
    this.router.navigate(['/stagiaires/nouveau']);
  }
}
