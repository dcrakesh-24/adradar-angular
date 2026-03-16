import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { from, map, of, shareReplay, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface HelpCenterTocItem {
  id: string;
  label: string;
}

export interface HelpCenterDoc {
  html: SafeHtml;
  toc: HelpCenterTocItem[];
}

interface HelpCenterDocxConfigEntry {
  slug: string;
  title?: string;
  file: string;
}

@Injectable({ providedIn: 'root' })
export class HelpCenterDocsService {
  private readonly configPath = 'assets/help-center/docx-config.json';
  // DOCX files are stored under assets/help-center/docs
  private readonly docsFolder = 'assets/help-center/docs';

  private config$ = this.createConfigStream();

  private htmlCache = new Map<string, string>();

  constructor(
    private readonly sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  private createConfigStream() {
    if (!isPlatformBrowser(this.platformId)) {
      // During SSR, skip loading config to avoid Node relative URL fetch errors.
      return of<HelpCenterDocxConfigEntry[]>([]);
    }

    return from(fetch(this.configPath, { cache: 'no-store' }).then(r => (r.ok ? r.json() : []))).pipe(
      map(raw => (Array.isArray(raw) ? (raw as HelpCenterDocxConfigEntry[]) : [])),
      shareReplay(1)
    );
  }

  getDocBySlug(slug: string) {
    return this.config$.pipe(
      map(entries => entries.find(e => e.slug === slug)?.file),
      switchMap(file => {
        if (!file) return of<HelpCenterDoc>({ html: this.sanitizer.bypassSecurityTrustHtml(''), toc: [] });
        return from(this.loadDocxAsHtml(file)).pipe(
          map(html => {
            const withIds = this.addHeadingIds(html);
            const toc = this.extractTocFromContent(withIds);
            return { html: this.sanitizer.bypassSecurityTrustHtml(withIds), toc };
          })
        );
      }),
      shareReplay(1)
    );
  }

  private async loadDocxAsHtml(fileName: string): Promise<string> {
    const cached = this.htmlCache.get(fileName);
    if (cached) return cached;

    const encoded = encodeURIComponent(fileName);
    const path = `${this.docsFolder}/${encoded}`;
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) return '<p>Document not found.</p>';

    const mammoth = await import('mammoth/mammoth.browser');
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value || '<p>No content could be extracted from this file.</p>';
    this.htmlCache.set(fileName, html);
    return html;
  }

  private extractTocFromContent(content: string): HelpCenterTocItem[] {
    const toc: HelpCenterTocItem[] = [];
    const headingRegex = /<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/gi;
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(content)) !== null) {
      const label = match[2].replace(/<[^>]+>/g, '').trim();
      if (label) toc.push({ id: match[1], label });
    }
    return toc;
  }

  private addHeadingIds(content: string): string {
    if (!content) return content;
    let headingIndex = 0;
    return content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_full, attrs: string, title: string) => {
      if (/\sid=/.test(attrs)) return `<h2${attrs}>${title}</h2>`;
      const cleanTitle = title.replace(/<[^>]+>/g, '').trim().toLowerCase();
      const slug = cleanTitle
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const id = slug || `section-${headingIndex++}`;
      return `<h2${attrs} id="${id}">${title}</h2>`;
    });
  }
}

