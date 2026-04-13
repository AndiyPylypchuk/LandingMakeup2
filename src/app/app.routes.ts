import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
  { path: 'contacts', loadComponent: () => import('./pages/contacts/contacts.component').then(m => m.ContactsComponent) },
  { path: 'v/:slug', loadComponent: () => import('./pages/funnel/funnel.component').then(m => m.FunnelComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
