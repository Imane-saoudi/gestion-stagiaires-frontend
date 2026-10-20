import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { StagiaireService } from '../../../core/services/stagiaire.service';
import { TypeStage, StatutStage } from '../../../core/models/enums';

@Component({
  selector: 'app-stagiaire-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './stagiaire-form.component.html',
  styleUrl: './stagiaire-form.component.css'
})
export class StagiaireFormComponent implements OnInit {
  form!: FormGroup;
  isEdition = false;
  stagiaireId: number | null = null;
  typeStageOptions = Object.values(TypeStage);
  statutOptions = Object.values(StatutStage);

  dureeCalculee: number | null = null;
  cinDejaUtilise = false;

  constructor(
    private fb: FormBuilder,
    private stagiaireService: StagiaireService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Recalcule automatiquement la durée quand les dates changent
    this.form.get('dateDebut')?.valueChanges.subscribe(() => this.calculerDuree());
    this.form.get('dateFin')?.valueChanges.subscribe(() => this.calculerDuree());

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdition = true;
      this.stagiaireId = +idParam;
      this.stagiaireService.getById(this.stagiaireId).subscribe({
        next: (s) => {
          this.form.patchValue(s);
          this.calculerDuree();
        },
        error: (err) => console.error('Erreur chargement stagiaire', err)
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      cin: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      nationalite: [''],
      adresse: [''],
      ville: [''],
      telephone: [''],
      email: ['', [Validators.required, Validators.email]],

      universite: ['', Validators.required],
      filiere: ['', Validators.required],
      niveauEtude: [''],
      diplomePrepare: [''],
      anneeUniversitaire: [''],

      typeStage: ['', Validators.required],
      sujetStage: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      serviceAffectation: ['', Validators.required],

      statut: [StatutStage.EN_COURS_TRAITEMENT, Validators.required]
    });
  }

  // Calcule automatiquement la durée du stage en jours (champ "Durée" du cahier des charges)
  calculerDuree(): void {
    const debut = this.form.get('dateDebut')?.value;
    const fin = this.form.get('dateFin')?.value;
    if (debut && fin) {
      const d1 = new Date(debut);
      const d2 = new Date(fin);
      const diffMs = d2.getTime() - d1.getTime();
      this.dureeCalculee = diffMs >= 0 ? Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1 : null;
    } else {
      this.dureeCalculee = null;
    }
  }

  // Vérifie l'unicité du CIN (contrainte fonctionnelle du cahier des charges)
  verifierCin(): void {
    const cin = this.form.get('cin')?.value;
    if (!cin) {
      this.cinDejaUtilise = false;
      return;
    }
    this.stagiaireService.checkCinUnique(cin, this.stagiaireId ?? undefined).subscribe({
      next: (estUnique) => (this.cinDejaUtilise = !estUnique),
      error: (err) => console.error('Erreur vérification CIN', err)
    });
  }

  // Petit utilitaire pour afficher les messages d'erreur dans le template
  champInvalide(nomChamp: string): boolean {
    const champ = this.form.get(nomChamp);
    return !!champ && champ.invalid && (champ.touched || champ.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid || this.cinDejaUtilise) {
      this.form.markAllAsTouched();
      return;
    }

    const dateDebut = new Date(this.form.value.dateDebut);
    const dateFin = new Date(this.form.value.dateFin);
    if (dateFin < dateDebut) {
      alert('La date de fin doit être postérieure ou égale à la date de début.');
      return;
    }

    const payload = { ...this.form.value, duree: this.dureeCalculee };

    if (this.isEdition && this.stagiaireId) {
      this.stagiaireService.update(this.stagiaireId, payload).subscribe({
        next: () => this.router.navigate(['/stagiaires']),
        error: (err) => console.error('Erreur mise à jour', err)
      });
    } else {
      this.stagiaireService.create(payload).subscribe({
        next: () => this.router.navigate(['/stagiaires']),
        error: (err) => console.error('Erreur création', err)
      });
    }
  }

  annuler(): void {
    this.router.navigate(['/stagiaires']);
  }
}
