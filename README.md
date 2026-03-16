# Ad Radar - Angular SSR Application

A full **Angular 17 application with Server-Side Rendering (SSR)** converting the Ad Radar multi-page HTML site into a modern Angular application.

## 🏗️ Architecture

### Framework & Features
- **Angular 17** with standalone components (no NgModules)
- **Server-Side Rendering (SSR)** via `@angular/ssr` + Express.js
- **Lazy-loaded routes** for optimal code splitting
- **Angular Router** with scroll position restoration
- **Client Hydration** for seamless CSR/SSR transition

### Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Sticky navbar with mobile hamburger
│   │   ├── footer/           # Footer with legal links
│   │   └── gdpr-banner/      # Cookie consent banner (localStorage)
│   ├── pages/
│   │   ├── home/             # Main landing page (Ad Radar)
│   │   ├── hiretap/          # HireTap product page
│   │   ├── gdpr/             # GDPR Compliance
│   │   ├── website-terms/    # Website Terms of Service
│   │   ├── website-privacy/  # Website Privacy Policy
│   │   ├── platform-terms/   # Platform Terms of Service
│   │   ├── platform-privacy/ # Platform Privacy Policy
│   │   └── security/         # Security Policy
│   ├── app.component.ts      # Root component
│   ├── app.config.ts         # Application config + providers
│   └── app.routes.ts         # Route definitions
├── index.html
├── main.ts                   # Browser bootstrap
├── main.server.ts            # Server bootstrap
└── styles.scss               # Global SCSS styles
├── server.ts                 # Express SSR server
└── angular.json              # Angular CLI config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm start
# App runs at http://localhost:4200
```

### Build for Production (with SSR)
```bash
npm run build:ssr
```

### Serve SSR Build
```bash
npm run serve:ssr
# App runs at http://localhost:4000
```

### Prerender (Static Generation)
```bash
npm run prerender
```

## 📄 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeComponent | Ad Radar main landing page |
| `/hiretap` | HiretapComponent | HireTap hiring platform page |
| `/gdpr-compliance` | GdprComponent | GDPR compliance info |
| `/website-terms` | WebsiteTermsComponent | Website terms of service |
| `/website-privacy-policy` | WebsitePrivacyComponent | Website privacy policy |
| `/platform-terms` | PlatformTermsComponent | Platform terms of service |
| `/platform-privacy-policy` | PlatformPrivacyComponent | Platform privacy policy |
| `/security-policy` | SecurityComponent | Security policy |

## 🎨 Styling

- Global SCSS in `src/styles.scss`
- CSS custom properties for brand colors and gradients
- Responsive design with mobile-first approach
- External stylesheets from Recotap CDN for existing component library

## 🔑 SSR Key Decisions

1. **`isPlatformBrowser`** checks protect browser-only APIs (localStorage, HostListener on document)
2. **`PLATFORM_ID` injection** used in GDPR banner and header components
3. **`provideClientHydration()`** enables hydration of server-rendered content
4. **Lazy loading** on all page routes reduces initial bundle size

## 🌐 External Dependencies

The app references Recotap CDN assets for:
- CSS framework (`uni-core.min.css`, `main.min.css`)
- Icon fonts (`unicons.min.css`)
- Images and logos from `www.recotap.com`
- Bootstrap JS components
