import { Component, signal, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gdpr-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (visible()) {
      <div class="gdpr-banner card shadow-sm" [class.hidden]="!visible()">
        <button class="close-btn btn btn-link p-0" (click)="dismiss()" aria-label="Close">✕</button>
        <h6 class="mb-2">🍪 GDPR Compliance</h6>
        <p>
          We use cookies to ensure you get the best experience on our website.
          By continuing to use our site, you accept our use of cookies,
          <a routerLink="/platform-privacy-policy">privacy policy</a> and
          <a routerLink="/platform-terms">terms of service</a>.
        </p>
        <button class="btn-accept btn btn-danger rounded-pill" (click)="accept()">Accept</button>
      </div>
    }
  `
})
export class GdprBannerComponent implements OnInit {
  visible = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const accepted = localStorage.getItem('gdpr_accepted');
      if (!accepted) {
        setTimeout(() => this.visible.set(true), 1500);
      }
    }
  }

  accept() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('gdpr_accepted', 'true');
    }
    this.visible.set(false);
  }

  dismiss() {
    this.visible.set(false);
  }
}
