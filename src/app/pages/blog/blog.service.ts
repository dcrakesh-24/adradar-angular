import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, interval, Subscription, Observable, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Blog, BlogApiResponse } from './blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService implements OnDestroy {

  private apiUrl = `https://your-api.com/api/blogs`; // 🔁 Replace with your real API URL

  private publishedBlogsSubject = new BehaviorSubject<Blog[]>([]);
  public publishedBlogs$ = this.publishedBlogsSubject.asObservable();

  private activeBlogSubject = new BehaviorSubject<Blog | null>(null);
  public activeBlog$ = this.activeBlogSubject.asObservable();

  private schedulerSubscription!: Subscription;
  private POLL_INTERVAL_MS = 60000; // every 60 seconds

  constructor(private http: HttpClient) {
    this.startScheduler();
  }

  getPublishedBlogs(page = 1, limit = 10): Observable<BlogApiResponse> {
    const params = new HttpParams()
      .set('status', 'published')
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<BlogApiResponse>(this.apiUrl, { params }).pipe(
      tap(response => this.publishedBlogsSubject.next(response.data)),
      catchError(err => {
        console.error('Error fetching published blogs:', err);
        return of({ data: [], total: 0, page: 1 });
      })
    );
  }

  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`).pipe(
      tap(blog => this.activeBlogSubject.next(blog)),
      catchError(err => {
        console.error(`Error fetching blog ${id}:`, err);
        throw err;
      })
    );
  }

  private getScheduledBlogs(): Observable<Blog[]> {
    const params = new HttpParams().set('status', 'scheduled');
    return this.http.get<BlogApiResponse>(this.apiUrl, { params }).pipe(
      switchMap(response => of(response.data)),
      catchError(() => of([]))
    );
  }

  private publishBlog(blog: Blog): void {
    this.http.patch<Blog>(`${this.apiUrl}/${blog.id}/publish`, {}).pipe(
      catchError(() => of(null))
    ).subscribe(result => {
      if (result) {
        console.log(`✅ Blog published: "${blog.title}"`);
        const current = this.publishedBlogsSubject.getValue();
        this.publishedBlogsSubject.next([{ ...blog, status: 'published' }, ...current]);
      }
    });
  }

  private startScheduler(): void {
    this.checkAndPublishDueBlogs();
    this.schedulerSubscription = interval(this.POLL_INTERVAL_MS).pipe(
      switchMap(() => this.getScheduledBlogs())
    ).subscribe((scheduledBlogs: Blog[]) => {
      const now = new Date();
      scheduledBlogs.forEach(blog => {
        if (new Date(blog.scheduledAt) <= now) {
          this.publishBlog(blog);
        }
      });
    });
  }

  private checkAndPublishDueBlogs(): void {
    this.getScheduledBlogs().subscribe((blogs: Blog[]) => {
      const now = new Date();
      blogs.forEach(blog => {
        if (new Date(blog.scheduledAt) <= now) this.publishBlog(blog);
      });
    });
  }

  setActiveBlog(blog: Blog): void { this.activeBlogSubject.next(blog); }
  clearActiveBlog(): void { this.activeBlogSubject.next(null); }

  ngOnDestroy(): void {
    this.schedulerSubscription?.unsubscribe();
  }
}
