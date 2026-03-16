import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface HelpCenterSection {
  id: string;
  label: string;
  html: SafeHtml;
}

export interface HelpCenterPageContent {
  sections: HelpCenterSection[];
}

@Injectable({ providedIn: 'root' })
export class HelpCenterContentService {
  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  getPage(slug: string): Observable<HelpCenterPageContent> {
    // During SSR we skip loading markdown assets to avoid Node fetch relative-URL errors.
    if (!isPlatformBrowser(this.platformId)) {
      return of({ sections: [] });
    }

    const url = `/assets/help-center/${slug}.md`;

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(markdown => this.parseMarkdown(markdown)),
      // If the file is missing or fails to load, fail gracefully with empty content
      // so the UI doesn't render a blank page.
      // eslint-disable-next-line rxjs/no-ignored-error
      // @ts-ignore
      catchError(() => of({ sections: [] as HelpCenterSection[] })),
      shareReplay(1)
    );
  }

  private parseMarkdown(markdown: string): HelpCenterPageContent {
    const lines = markdown.split(/\r?\n/);
    const sections: HelpCenterSection[] = [];

    // Use a simple internal shape with raw markdown, then convert to SafeHtml once per section.
    let current: { id: string; label: string; raw: string } | null = null;
    const pushCurrent = () => {
      if (current) {
        sections.push({
          id: current.id,
          label: current.label,
          html: this.toHtml(current.raw.trim())
        });
        current = null;
      }
    };

    for (const line of lines) {
      const headingMatch = /^##\s+(.+)$/.exec(line);
      if (headingMatch) {
        pushCurrent();
        const label = headingMatch[1].trim();
        const id = this.slugify(label);
        current = { id, label, raw: '' };
      } else if (current) {
        current.raw += line + '\n';
      }
    }

    pushCurrent();

    return { sections };
  }

  private slugify(label: string): string {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Very small markdown-to-HTML converter for our limited use (paragraphs, lists, bold, simple video embeds)
  private toHtml(markdown: string): SafeHtml {
    const lines = markdown.split(/\r?\n/);
    const htmlLines: string[] = [];
    let inList = false;

    const closeList = () => {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();
      if (!line) {
        closeList();
        continue;
      }

      // Simple "Video Embed" pattern:
      // **Video Embed**
      // `https://video-url`
      if (/^\*\*video embed\*\*/i.test(line) && i + 1 < lines.length) {
        const next = lines[i + 1].trim();
        const urlMatch = /^`(.+?)`$/.exec(next);
        if (urlMatch) {
          closeList();
          const url = urlMatch[1];
          htmlLines.push(
            `<div class="help-video-embed"><iframe src="${url}" frameborder="0" allowfullscreen></iframe></div>`
          );
          i++; // skip URL line
          continue;
        }
      }

      if (line.startsWith('- ')) {
        if (!inList) {
          htmlLines.push('<ul>');
          inList = true;
        }
        const text = this.inlineMarkdown(line.substring(2).trim());
        htmlLines.push(`<li>${text}</li>`);
      } else {
        closeList();
        const text = this.inlineMarkdown(line);
        htmlLines.push(`<p>${text}</p>`);
      }
    }

    closeList();
    const html = htmlLines.join('\n');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private inlineMarkdown(text: string): string {
    // bold **text**
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}

