import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  erreur = '';

  constructor(private authService: AuthService, private router: Router) {}

  seConnecter(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/stagiaires']),
      error: () => (this.erreur = 'Identifiants incorrects.')
    });
  }
}
