import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Ad Radar - LinkedIn Ad Intelligence Platform'
  },
  {
    path: 'gdpr-compliance',
    loadComponent: () => import('./pages/gdpr/gdpr.component').then(m => m.GdprComponent),
    title: 'GDPR Compliance | Ad Radar'
  },
  {
    path: 'website-terms',
    loadComponent: () => import('./pages/website-terms/website-terms.component').then(m => m.WebsiteTermsComponent),
    title: 'Website Terms | Ad Radar'
  },
  {
    path: 'website-privacy-policy',
    loadComponent: () => import('./pages/website-privacy/website-privacy.component').then(m => m.WebsitePrivacyComponent),
    title: 'Website Privacy Policy | Ad Radar'
  },
  {
    path: 'platform-terms',
    loadComponent: () => import('./pages/platform-terms/platform-terms.component').then(m => m.PlatformTermsComponent),
    title: 'Platform Terms | Ad Radar'
  },
  {
    path: 'platform-privacy-policy',
    loadComponent: () => import('./pages/platform-privacy/platform-privacy.component').then(m => m.PlatformPrivacyComponent),
    title: 'Platform Privacy Policy | Ad Radar'
  },
  {
    path: 'security-policy',
    loadComponent: () => import('./pages/security/security.component').then(m => m.SecurityComponent),
    title: 'Security Policy | Ad Radar'
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent),
    title: 'Blog | Ad Radar'
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent),
    title: 'Blog Post | Ad Radar'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
