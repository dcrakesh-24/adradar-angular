import { Component, signal, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="app-navbar sticky-top">
      <div class="navbar-inner container-fluid">
        <div class="logo d-flex align-items-center">
          <a routerLink="/"  aria-label="AdRadar home">
           <img src="./assets/adradar-logo.png" alt="AdRadar logo" />
          </a>
        </div>

        <ul class="nav-links d-flex align-items-center mb-0" [class.open]="menuOpen()">
          <li><a href="#how-it-works" (click)="closeMenu()">How it works</a></li>
          <li><a href="#copilots" (click)="closeMenu()">Copilots</a></li>
          <li><a href="#compare" (click)="closeMenu()">Compare</a></li>
          <li><a href="#pricing" (click)="closeMenu()">Pricing</a></li>
          <li>
            <a href="#pricing" class="cta-btn rounded-pill" (click)="closeMenu()">
              <span>Start Free</span>
              <span class="cta-arrow"><i class="bi bi-arrow-right"></i></span>
            </a>
          </li>
        </ul>

        <button class="hamburger btn btn-link p-0" (click)="toggleMenu()" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  menuOpen = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.app-navbar')) {
      this.menuOpen.set(false);
    }
  }
}
