export interface HistoriqueStatut {
  id?: number;
  stagiaireId: number;
  ancienStatut: string;
  nouveauStatut: string;
  dateModification: string;
  utilisateur?: string;
}
