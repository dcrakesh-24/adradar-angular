import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HELP_CENTER_NAV_ITEMS, HelpCenterNavItem } from '../../shared/help-center.constants';
import { HelpCenterDocsService } from '../../shared/help-center-docs.service';

@Component({
  standalone: true,
  selector: 'app-help-center-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './help-center-layout.component.html',
  styleUrls: ['./help-center-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpCenterLayoutComponent {
  readonly navItems: HelpCenterNavItem[] = HELP_CENTER_NAV_ITEMS;

  expandedIndex = 0;

  readonly tocItems$: Observable<{ id: string; label: string }[]> = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    switchMap(() => {
      // Drill down to the deepest active child route
      let child: ActivatedRoute = this.route;
      while (child.firstChild) {
        child = child.firstChild;
      }
      const data = child.snapshot.data ?? {};
      const slug = (data['slug'] as string) || child.routeConfig?.path || '';
      if (!slug) {
        return of([]);
      }
      return this.docs.getDocBySlug(slug).pipe(map(doc => doc.toc));
    })
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly docs: HelpCenterDocsService
  ) {}

  toggleGroup(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

}

