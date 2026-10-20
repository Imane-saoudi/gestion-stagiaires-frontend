import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DocumentService } from '../../../core/services/document.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent {
  @Input() stagiaireId!: number;
  @Output() documentAjoute = new EventEmitter<void>();

  typeDocument = '';
  fichierSelectionne: File | null = null;
  typesDocuments = [
    'CV',
    'Lettre de motivation',
    'Convention de stage',
    'Attestation de scolarité',
    'Assurance',
    'Carte nationale (optionnelle)'
  ];

  constructor(private documentService: DocumentService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierSelectionne = input.files[0];
    }
  }

  envoyer(): void {
    if (!this.typeDocument || !this.fichierSelectionne) {
      alert('Veuillez choisir un type de document et un fichier.');
      return;
    }
    this.documentService.upload(this.stagiaireId, this.typeDocument, this.fichierSelectionne).subscribe({
      next: () => {
        this.typeDocument = '';
        this.fichierSelectionne = null;
        this.documentAjoute.emit();
      },
      error: (err) => console.error('Erreur upload document', err)
    });
  }
}
