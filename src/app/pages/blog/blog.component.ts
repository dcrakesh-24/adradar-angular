import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { BlogService } from './blog.service';
import { Blog } from './blog.model';

interface TocItem {
  id: string;
  text: string;
}

interface DocxConfigEntry {
  file: string;
  title?: string;
  slug?: string;
}

interface LocalDocxPostMeta {
  id: string;
  file: string;
  title: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [BlogService],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  isLoading = false;
  error: string | null = null;
  currentPage = 1;
  totalBlogs = 0;
  blogsPerPage = 10;

  activeBlog: Blog | null = null;
  safeContent: SafeHtml | null = null;
  isDetailView = false;
  useDocxMode = true;
  isParsingDocx = false;
  docxUploadError: string | null = null;
  tocItems: TocItem[] = [];
  private readonly localDocxConfigPath = 'assets/blogs/docx-config.json';
  private localDocxPosts: LocalDocxPostMeta[] = [];
  private localDocxContentCache = new Map<string, string>();
  private blogServiceInstance?: BlogService;

  private subscriptions: Subscription[] = [];

  constructor(
    private injector: Injector,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.paramMap.subscribe(params => {
      const blogId = params.get('id');
      if (blogId) {
        this.loadBlogDetail(blogId);
      } else {
        this.isDetailView = false;
        if (!this.useDocxMode) {
          this.loadBlogs();
        } else {
          void this.loadDocxManifest();
          this.error = null;
        }
      }
    });
    this.subscriptions.push(routeSub);

    if (!this.useDocxMode) {
      const publishSub = this.getBlogService().publishedBlogs$.subscribe(blogs => {
        if (!this.isDetailView) this.blogs = blogs;
      });
      this.subscriptions.push(publishSub);
    }
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.error = null;
    this.getBlogService().getPublishedBlogs(this.currentPage, this.blogsPerPage).subscribe({
      next: (response) => {
        this.blogs = response.data;
        this.totalBlogs = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadBlogDetail(id: string): void {
    if (this.useDocxMode) {
      void this.loadLocalBlogDetail(id);
      return;
    }

    const localBlog = this.blogs.find(blog => blog.id === id);
    if (localBlog) {
      const contentWithHeadingIds = this.addHeadingIds(localBlog.content);
      this.isDetailView = true;
      this.isLoading = false;
      this.error = null;
      this.activeBlog = { ...localBlog, content: contentWithHeadingIds };
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(contentWithHeadingIds);
      this.tocItems = this.extractTocFromContent(contentWithHeadingIds);
      return;
    }

    this.isDetailView = true;
    this.isLoading = true;
    this.error = null;
    this.getBlogService().getBlogById(id).subscribe({
      next: (blog) => {
        const contentWithHeadingIds = this.addHeadingIds(blog.content);
        this.activeBlog = { ...blog, content: contentWithHeadingIds };
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(contentWithHeadingIds);
        this.tocItems = this.extractTocFromContent(contentWithHeadingIds);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Blog not found or failed to load.';
        this.isLoading = false;
      }
    });
  }

  openBlog(blog: Blog): void {
    if (this.useDocxMode) {
      this.isDetailView = true;
      this.isLoading = true;
      this.error = null;
      this.activeBlog = null;
    }
    this.router.navigate(['/blog', blog.id]);
  }

  goBack(): void {
    this.tocItems = [];
    this.router.navigate(['/blog']);
  }

  onPageChange(page: number): void {
    if (this.useDocxMode) return;
    this.currentPage = page;
    this.loadBlogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.totalBlogs / this.blogsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  getReadTime(content: string): string {
    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return `${Math.ceil(wordCount / 200)} min read`;
  }

  get featuredBlog(): Blog | null {
    return this.blogs.length ? this.blogs[0] : null;
  }

  get regularBlogs(): Blog[] {
    return this.blogs.slice(1);
  }

  getExcerpt(content: string, maxLength = 220): string {
    const text = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return 'Open this article to read the full content.';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  }

  shareOnX(): void {
    if (!this.activeBlog) return;
    const shareText = `${this.activeBlog.title}`;
    const url = this.getCurrentUrl();
    this.openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`);
  }

  shareOnFacebook(): void {
    const url = this.getCurrentUrl();
    this.openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  }

  shareOnLinkedIn(): void {
    const url = this.getCurrentUrl();
    this.openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
  }

  scrollToSection(sectionId: string): void {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async loadDocxManifest(): Promise<void> {
    this.isParsingDocx = true;
    this.isLoading = true;
    this.docxUploadError = null;
    this.error = null;

    try {
      const response = await fetch(this.localDocxConfigPath, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Could not read ${this.localDocxConfigPath}`);
      }
      const rawConfig = await response.json() as unknown;
      const configEntries = this.normalizeDocxConfig(rawConfig);
      if (!configEntries.length) {
        throw new Error('No DOCX files found in config.');
      }

      this.localDocxPosts = configEntries.map((entry) => {
        const file = entry.file.trim();
        const id = entry.slug?.trim() || this.getRouteIdFromFileName(file);
        const title = entry.title?.trim() || this.getTitleFromFileName(file);
        return { id, file, title };
      });

      const now = new Date().toISOString();
      this.blogs = this.localDocxPosts.map((post) => ({
        id: post.id,
        title: post.title,
        author: 'Local Upload',
        thumbnail: '',
        content: '',
        status: 'published',
        scheduledAt: now,
        createdAt: now,
        updatedAt: now,
        category: 'Local Preview',
        tags: ['docx']
      }));
    } catch {
      this.blogs = [];
      this.docxUploadError = 'Failed to load DOCX list. Check assets/blogs/docx-config.json.';
    } finally {
      this.isParsingDocx = false;
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private extractTocFromContent(content: string): TocItem[] {
    const toc: TocItem[] = [];
    const headingRegex = /<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/gi;
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(content)) !== null) {
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        toc.push({ id: match[1], text });
      }
    }

    return toc;
  }

  private addHeadingIds(content: string): string {
    if (!content) return content;
    let headingIndex = 0;
    return content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_full, attrs: string, title: string) => {
      if (/\sid=/.test(attrs)) {
        return `<h2${attrs}>${title}</h2>`;
      }
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

  private openShareWindow(url: string): void {
    if (typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer,width=700,height=500');
  }

  private getCurrentUrl(): string {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }

  private async loadLocalBlogDetail(id: string): Promise<void> {
    this.isDetailView = true;
    this.isLoading = true;
    this.error = null;

    if (!this.localDocxPosts.length) {
      await this.loadDocxManifest();
    }

    const localPost = this.localDocxPosts.find((post) => post.id === id);
    if (!localPost) {
      this.error = 'Local blog route not found.';
      this.isLoading = false;
      return;
    }

    const listBlog = this.blogs.find((blog) => blog.id === id);
    if (!listBlog) {
      this.error = 'Local blog metadata not found.';
      this.isLoading = false;
      return;
    }

    try {
      const html = await this.loadDocxContentByFile(localPost.file);
      const contentWithHeadingIds = this.addHeadingIds(html);
      this.activeBlog = { ...listBlog, content: contentWithHeadingIds };
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(contentWithHeadingIds);
      this.tocItems = this.extractTocFromContent(contentWithHeadingIds);
      this.error = null;
    } catch {
      // this.error = `Failed to read DOCX file: ${localPost.file}`;
    }

    this.isLoading = false;
  }

  private getRouteIdFromFileName(fileName: string): string {
    const base = fileName.replace(/\.docx$/i, '').trim();
    return base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'blog';
  }

  private getTitleFromFileName(fileName: string): string {
    const base = fileName.replace(/\.docx$/i, '').trim();
    if (!base) return 'Local Blog';
    return base
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private normalizeDocxConfig(rawConfig: unknown): DocxConfigEntry[] {
    if (Array.isArray(rawConfig)) {
      return rawConfig
        .filter((item): item is DocxConfigEntry => !!item && typeof item === 'object' && 'file' in item && typeof (item as { file: unknown }).file === 'string')
        .map((item) => ({ file: item.file, title: item.title, slug: item.slug }));
    }

    if (
      rawConfig &&
      typeof rawConfig === 'object' &&
      'file' in rawConfig &&
      typeof (rawConfig as { file: unknown }).file === 'string'
    ) {
      const single = rawConfig as DocxConfigEntry;
      return [{ file: single.file, title: single.title, slug: single.slug }];
    }

    return [];
  }

  private async loadDocxContentByFile(fileName: string): Promise<string> {
    const cacheKey = fileName;
    const cached = this.localDocxContentCache.get(cacheKey);
    if (cached) return cached;

    const encodedFileName = encodeURIComponent(fileName);
    const filePath = `assets/blogs/${encodedFileName}`;
    const response = await fetch(filePath, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Could not read ${filePath}`);
    }

    const mammoth = await import('mammoth/mammoth.browser');
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value || '<p>No content could be extracted from this file.</p>';
    this.localDocxContentCache.set(cacheKey, html);
    return html;
  }

  private getBlogService(): BlogService {
    if (!this.blogServiceInstance) {
      this.blogServiceInstance = this.injector.get(BlogService);
    }
    return this.blogServiceInstance;
  }
}
