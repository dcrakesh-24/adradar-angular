import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { HelpCenterDocsService } from '../../shared/help-center-docs.service';

@Component({
  standalone: true,
  selector: 'app-help-center-article',
  imports: [CommonModule, RouterModule],
  templateUrl: './help-center-article.component.html',
  styleUrls: ['./help-center-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpCenterArticleComponent {
  readonly data$ = this.route.data.pipe(
    switchMap(data => {
      const title = data['title'] as string;
      const category = data['category'] as string;
      const slug = (data['slug'] as string) || this.route.snapshot.routeConfig?.path || '';

      return this.docs.getDocBySlug(slug).pipe(
        map(doc => ({
          title,
          category,
          html: doc.html
        }))
      );
    })
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly docs: HelpCenterDocsService
  ) {}
}

