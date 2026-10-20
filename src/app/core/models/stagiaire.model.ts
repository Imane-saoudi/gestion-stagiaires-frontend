import { TypeStage, StatutStage } from './enums';
import { DocumentStagiaire } from './document.model';

export interface Stagiaire {
  id?: number;
  numeroDossier?: string;
  cin: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  nationalite: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;

  universite: string;
  filiere: string;
  niveauEtude: string;
  diplomePrepare: string;
  anneeUniversitaire: string;

  typeStage: TypeStage;
  sujetStage: string;
  dateDebut: string;
  dateFin: string;
  duree?: number;
  serviceAffectation: string;

  statut: StatutStage;
  documents?: DocumentStagiaire[];
}
