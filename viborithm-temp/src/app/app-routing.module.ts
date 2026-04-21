import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TracksComponent } from './pages/tracks/tracks.component';
import { SavedComponent } from './pages/saved/saved.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';
import { ShazamComponent } from './pages/shazam/shazam.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tracks', component: TracksComponent, canActivate: [AuthGuard] },
  { path: 'saved', component: SavedComponent, canActivate: [AuthGuard] },
  { path: 'recommendations', component: RecommendationsComponent, canActivate: [AuthGuard] },
  { path: 'shazam', component: ShazamComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }, // ← всегда последним!
];