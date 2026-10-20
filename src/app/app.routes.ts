import { Routes } from '@angular/router';
import { StagiaireListComponent } from './features/stagiaires/stagiaire-list/stagiaire-list.component';
import { StagiaireFormComponent } from './features/stagiaires/stagiaire-form/stagiaire-form.component';
import { StagiaireDetailComponent } from './features/stagiaires/stagiaire-detail/stagiaire-detail.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'stagiaires', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'stagiaires', component: StagiaireListComponent },
  { path: 'stagiaires/nouveau', component: StagiaireFormComponent },
  { path: 'stagiaires/:id', component: StagiaireDetailComponent },
  { path: 'stagiaires/:id/modifier', component: StagiaireFormComponent },
  { path: '**', redirectTo: 'stagiaires' }
];
