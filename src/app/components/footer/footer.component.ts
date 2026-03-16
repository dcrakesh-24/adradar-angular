import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="app-footer">
      <div class="footer-inner container-fluid">
        <div class="footer-top">
          <div class="footer-brand">
            <a routerLink="/" aria-label="AdRadar home" class="footer-logo-small-link mb-5">
              <img [src]="smallLogoSrc" alt="AdRadar logo" class="footer-logo-small" />
            </a>
            <p class="footer-tagline">The AI Copilot for LinkedIn Ads.<br />Stop guessing. Start knowing.</p>
            <div class="footer-socials">
              <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
              <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
            </div>
            <div class="footer-copy">Copyright &copy; {{ currentYear }} Zyfors. All Rights Reserved.</div>
          </div>

          <div class="footer-links-grid">
            <div class="footer-col">
              <div class="footer-col-title">Product</div>
              <a routerLink="/" fragment="how-it-works">How it works</a>
              <a routerLink="/" fragment="copilots">AI Copilots</a>
              <a routerLink="/" fragment="pricing">Pricing</a>
              <a routerLink="/" fragment="compare">Compare</a>
            </div>

            <div class="footer-col">
              <div class="footer-col-title">Use Cases</div>
              <a href="#">Demand Gen Teams</a>
              <a href="#">Performance Marketing</a>
              <a href="#">ABM Teams</a>
              <a href="#">Agencies</a>
            </div>

            <div class="footer-col">
              <div class="footer-col-title">Company</div>
              <a href="#">About</a>
              <a routerLink="/blog">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>

            <div class="footer-col">
              <div class="footer-col-title">Legal</div>
              <a routerLink="/website-privacy-policy">Privacy Policy</a>
              <a routerLink="/website-terms">Terms of Service</a>
              <a routerLink="/security-policy">Security</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <img [src]="bigLogoSrc" alt="adradar" class="footer-logo-large" />
          <div class="footer-bottom-links">
            <a routerLink="/website-terms">Terms of Service</a>
            <a routerLink="/website-privacy-policy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  smallLogoSrc = '/assets/adradar-2.png';
  bigLogoSrc = '/assets/adradar.png';
}
