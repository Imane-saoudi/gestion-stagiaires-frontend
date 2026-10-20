import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
  @Input() statut = '';

  get cssClass(): string {
    const map: { [key: string]: string } = {
      'Demande en cours de traitement': 'badge-attente',
      'Demande acceptée': 'badge-acceptee',
      'Demande refusée': 'badge-refusee',
      'Stage en cours': 'badge-encours',
      'Stage terminé': 'badge-termine',
      'Stage annulé': 'badge-annule'
    };
    return map[this.statut] || 'badge-default';
  }
}
