import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

interface PainPoint {
  icon: string;
  title: string;
  description: string;
  insightImage: string;
  insightImageAlt: string;
}

interface TimelineStep {
  label: string;
  title: string;
  description: string;
}

interface TimelineVisual {
  title: string;
  metric: string;
  metricLabel: string;
  image: string;
  imageAlt: string;
}

interface SpecialistCard {
  title: string;
  description: string;
  stat: string;
  tone: string;
  icon: string;
  iconAlt: string;
}

interface TestimonialCard {
  quote: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  companyLogoAlt: string;
}

interface PricingPlan {
  label: string;
  name: string;
  price: string;
  billingText: string;
  featured?: boolean;
  features: string[];
  ctaText: string;
}

interface CompanyLogo {
  name: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('timelineStep') timelineStepRefs!: QueryList<ElementRef<HTMLElement>>;

  readonly companyLogos: CompanyLogo[] = [
    { name: 'CRISIL', image: '/assets/home/images/crisil.png', alt: 'CRISIL logo' },
    { name: 'sprinklr', image: '/assets/home/images/sprinklr.png', alt: 'Sprinklr logo' },
    { name: 'WNS', image: '/assets/home/images/wns.png', alt: 'WNS logo' },
    { name: 'darwinbox', image: '/assets/home/images/darwinbox.png', alt: 'Darwinbox logo' },
    { name: 'everstage', image: '/assets/home/images/everstage.png', alt: 'Everstage logo' },
    { name: 'SPRINTO', image: '/assets/home/images/sprinto.png', alt: 'SPRINTO logo' }
  ];

  readonly painPoints: PainPoint[] = [
    {
      icon: '/assets/home/images/share.svg',
      title: 'Optimisation is reactive - always late',
      description:
        "You catch waste weekly. It compounds daily. No early warning. By the time the altimeter drops, you've already lost altitude.",
      insightImage: '/assets/home/images/problem-1.png',
      insightImageAlt: 'Budget burn insight'

    },
    {
      icon: '/assets/home/images/people.svg',
      title: 'Audience targeting silently drifts',
      description:
        'Target quality slips over time as account lists age. ICP coverage weakens, but spend keeps flowing.',
      insightImage: '/assets/home/images/problem-2.png',
      insightImageAlt: 'Audience drift insight'
    },
    {
      icon: '/assets/home/images/ai.svg',
      title: 'Creative performance is tribal knowledge',
      description:
        'Teams rely on hunches because creative fatigue and format impact are not surfaced fast enough.',
      insightImage: '/assets/home/images/problem-3.png',
      insightImageAlt: 'Creative fatigue insight'
    },
    {
      icon: '/assets/home/images/tech.svg',
      title: 'Ads and pipeline fly in different aircraft',
      description:
        'Campaign metrics and pipeline outcomes live in separate systems. Decisions are made without full context.',
      insightImage: '/assets/home/images/problem-4.png',
      insightImageAlt: 'Pipeline attribution insight'
    },
    {
      icon: '/assets/home/images/abstract.svg',
      title: 'Fragmented data, no reasoning layer',
      description:
        'Data lives in silos across ad platforms, CRM, and analytics. Teams see numbers, not why they moved.',
      insightImage: '/assets/home/images/problem-5.png',
      insightImageAlt: 'Fragmented data insight'
    },
    {
      icon: '/assets/home/images/triangle.svg',
      title: 'Too many levers, zero guidance',
      description:
        'Budget, bid, audience, and creative controls are abundant, but priority guidance is missing.',
      insightImage: '/assets/home/images/problem-6.png',
      insightImageAlt: 'Optimisation guidance insight'
    },
    {
      icon: '/assets/home/images/linkedin.svg',
      title: 'Lack of benchmarking for B2B LinkedIn',
      description:
        'Without category and stage-aware benchmarks, teams cannot tell whether performance is good or just average.',
      insightImage: '/assets/home/images/problem-7.png',
      insightImageAlt: 'LinkedIn benchmark insight'
    },
    {
      icon: '/assets/home/images/cash.svg',
      title: 'Budget inefficiency and pacing anxiety',
      description:
        'Spend pacing is hard to trust, causing over-corrections late in the month and missed opportunities early.',
      insightImage: '/assets/home/images/problem-8.png',
      insightImageAlt: 'Budget pacing insight'
    }
  ];

  readonly timelineSteps: TimelineStep[] = [
    {
      label: 'PRE-FLIGHT',
      title: 'Connect LinkedIn Ads and CRM in 2 minutes',
      description:
        'OAuth in seconds. AdRadar syncs campaigns, audience data, and opportunities with no manual wiring.'
    },
    {
      label: 'TAKEOFF',
      title: 'Agents run their first audit immediately',
      description:
        'Audience, Creative, Spend, and Strategy agents sweep your account on first connect. You get a LinkedIn Ads Health Score and a ranked list of issues — most teams find something non-obvious before the first coffee is done.'
    },
    {
      label: 'CRUISE',
      title: 'Daily briefings replace dashboard checking',
      description:
        'Every morning: what shifted overnight, what needs attention, what to do first. AdRadar becomes the voice in your headset — not another tab you forget to check.'
    },
    {
      label: 'CONTROL',
      title: 'You approve every move. Always.',
      description:
        'Agents recommend. You decide. Human-in-the-loop by design — no black-box autopilot. Every action is explained, logged, and reversible. You’re always the captain.'
    }
  ];

  readonly timelineVisuals: TimelineVisual[] = [
    {
      title: 'LinkedIn to CRM Sync',
      metric: '2 min',
      metricLabel: 'Setup complete',
      image: '/assets/home/images/linkedin-crm.png',
      imageAlt: 'LinkedIn and CRM connection'
    },
    {
      title: 'LinkedIn Ads Health Score',
      metric: '75',
      metricLabel: 'Good',
      image: 'assets/home/images/linkedin-ads.png',
      imageAlt: 'Health score gauge'
    },
    {
      title: 'Today Briefing',
      metric: '$14,760',
      metricLabel: 'Pipeline impacted',
      image: 'assets/home/images/today-brief.png',
      imageAlt: 'Daily briefing card'
    },
    {
      title: 'Pending Approvals',
      metric: '2 actions',
      metricLabel: 'Awaiting your review',
      image: 'assets/home/images/pending-approval.png',
      imageAlt: 'Approvals panel'
    }
  ];

  readonly specialistCards: SpecialistCard[] = [
    {
      title: 'Company Blocking Agent',
      description: 'Automatically blocks companies outside your target audience to prevent budget leakage from audience drift.',
      stat: 'Higher ICP signal, lower wasted CPM',
      tone: 'tone-blue',
      icon: '/assets/home/images/account_blocking%201.svg',
      iconAlt: 'Company blocking agent icon'
    },
    {
      title: 'Impression Capping Agent',
      description: 'Limits impressions per company and excludes companies once the cap is reached, ensuring impressions are distributed across more target companies.',
      stat: 'Clear, scalable campaign design',
      tone: 'tone-green',
      icon: '/assets/home/images/impression_capping%202.svg',
      iconAlt: 'Impression capping agent icon'
    },
    {
      title: 'Title Blocking Agent',
      description: 'Detects and blocks irrelevant job titles to keep campaign targeting aligned with intended personas.',
      stat: 'Systematic creative learning',
      tone: 'tone-pink',
      icon: '/assets/home/images/title_blocking%201.svg',
      iconAlt: 'Title blocking agent icon'
    },
    {
      title: 'Bidding Optimization Agent',
      description: 'Limits impressions per company and excludes accounts once the cap is reached, ensuring impressions are distributed across more target companies.',
      stat: 'Controlled spend, measurable ROI',
      tone: 'tone-mint',
      icon: '/assets/home/images/bidding_optimization%201.svg',
      iconAlt: 'Bidding optimization agent icon'
    },
    {
      title: 'Campaign Scheduling Agent',
      description: 'Runs campaigns only during selected days and time windows to improve engagement and spend efficiency.',
      stat: 'Sustained performance, no sudden drops',
      tone: 'tone-amber',
      icon: '/assets/home/images/campaign_scheduling%201.svg',
      iconAlt: 'Campaign scheduling agent icon'
    },
    {
      title: 'Ad Rotation Agent',
      description: 'Limits impressions per company and excludes accounts once the cap is reached, ensuring impressions are distributed across more target companies.',
      stat: 'Proactive competitive advantage',
      tone: 'tone-purple',
      icon: '/assets/home/images/ad_rotation%201.svg',
      iconAlt: 'Ad rotation agent icon'
    },
    {
      title: 'Analyse competitors LinkedIn Ads',
      description: 'Limits impressions per company and excludes accounts once the cap is reached, ensuring impressions are distributed across more target companies.',
      stat: 'Proactive competitive advantage',
      tone: 'tone-teal',
      icon: '/assets/home/images/analyse_competitors%201.svg',
      iconAlt: 'Analyse competitors LinkedIn Ads icon'
    }
  ];

  readonly testimonials: TestimonialCard[] = [
    {
      quote:
        'AdRadar helped us identify where LinkedIn spend was stalling pipeline and exactly what to fix.',
      name: 'Angela Meyer',
      role: 'Growth Manager',
      company: 'CRISIL',
      companyLogo: '/assets/home/images/crisil.png',
      companyLogoAlt: 'CRISIL logo'
    },
    {
      quote:
        'The daily briefing became our execution layer. We stopped chasing dashboards and started shipping actions.',
      name: 'James Mento',
      role: 'Demand Gen Lead',
      company: 'darwinbox',
      companyLogo: '/assets/home/images/darwinbox.png',
      companyLogoAlt: 'darwinbox logo'
    },
    {
      quote:
        'The platform translates ad signals into clear recommendations. It gave us confidence and speed.',
      name: 'Kate Niera',
      role: 'Performance Lead',
      company: 'sprinklr',
      companyLogo: '/assets/home/images/sprinklr.png',
      companyLogoAlt: 'sprinklr logo'
    },
    {
      quote:
        'Finally, a way to tie account engagement with revenue conversations in one place.',
      name: 'Andy Ng',
      role: 'VP Marketing',
      company: 'everstage',
      companyLogo: '/assets/home/images/everstage.png',
      companyLogoAlt: 'everstage logo'
    },
    {
      quote:
        'Working with this AI copilot felt like having a strategist and operator in one. We moved faster with better clarity.',
      name: 'Talan Press',
      role: 'Manager at Luxonic',
      company: 'sprinklr',
      companyLogo: '/assets/home/images/sprinklr.png',
      companyLogoAlt: 'sprinklr logo'
    },
    {
      quote:
        'The optimization recommendations were practical and timely. We reduced wasted spend in the first two weeks.',
      name: 'Amelia Brynn',
      role: 'Strategy Lead',
      company: 'everstage',
      companyLogo: '/assets/home/images/everstage.png',
      companyLogoAlt: 'everstage logo'
    },
    {
      quote:
        'The diagnostics changed how we review campaigns. Better visibility, less guesswork, and faster team alignment.',
      name: 'Gretchen Rosser',
      role: 'Manager at Luxonic',
      company: 'WNS',
      companyLogo: '/assets/home/images/wns.png',
      companyLogoAlt: 'WNS logo'
    },
    {
      quote:
        'From targeting to pacing, every recommendation was actionable. The results clearly showed in campaign outcomes.',
      name: 'Marcus Leigh',
      role: 'Founder of Exemind',
      company: 'SPRINTO',
      companyLogo: '/assets/home/images/sprinto.png',
      companyLogoAlt: 'SPRINTO logo'
    }
  ];

  readonly testimonialsSlider: TestimonialCard[] = [...this.testimonials, ...this.testimonials];

  readonly pricingPlans: PricingPlan[] = [
    {
      label: 'STARTER',
      name: 'Free',
      price: '$0',
      billingText: 'forever',
      features: [
        'Connect LinkedIn Ads + CRM',
        'LinkedIn Ads Health Score',
        'Basic performance insights',
        'Manual audience blocking',
        'Limited competitor ad visibility',
        'Basic revenue attribution'
      ],
      ctaText: 'Get started free'
    },
    {
      label: 'REVENUE',
      name: 'Revenue',
      price: '$29',
      billingText: 'per month',
      features: [
        'Everything in Starter',
        'Full revenue attribution model',
        'Inbound CRM sync',
        'Company & campaign analytics',
        'Customer journey view',
        'Custom attribution models'
      ],
      ctaText: 'Start free trial'
    },
    {
      label: 'COPILOT AI',
      name: 'Copilot AI',
      price: '$59',
      billingText: 'per month - up to 5 campaigns',
      featured: true,
      features: [
        'Everything in Revenue',
        'AI impression capping agent',
        'Bidding optimization agent',
        'Scheduling & pacing agent',
        'Auto ICP account blocking',
        'Ad rotation recommendations',
        'Competitor LinkedIn ads analysis',
        '+$15 per 5 additional campaigns'
      ],
      ctaText: 'Start free trial'
    },
    {
      label: 'GROWTH & ABM',
      name: 'Growth + ABM',
      price: '$99',
      billingText: 'per month - up to 5 campaigns',
      features: [
        'Everything in Copilot AI',
        'Account scoring & ABM analytics',
        'Journey stage prediction model',
        'Outbound CRM sync (write back)',
        'Account score - CRM fields',
        '+$15 per 5 additional campaigns'
      ],
      ctaText: 'Start free trial'
    }
  ];

  activeHowItWorksIndex = 0;
  activePainPointIndex = 0;

  private stepObserver?: IntersectionObserver;
  private stepListSub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.bindTimelineObserver();
    this.stepListSub = this.timelineStepRefs.changes.subscribe(() => this.bindTimelineObserver());
  }

  ngOnDestroy(): void {
    this.stepObserver?.disconnect();
    this.stepListSub?.unsubscribe();
  }

  togglePainPoint(index: number): void {
    this.activePainPointIndex = this.activePainPointIndex === index ? -1 : index;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  }

  private bindTimelineObserver(): void {
    this.stepObserver?.disconnect();

    this.stepObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          const index = Number(entry.target.getAttribute('data-step-index'));
          if (!Number.isNaN(index)) {
            this.activeHowItWorksIndex = index;
          }
        });
      },
      {
        root: null,
        threshold: 0.45,
        rootMargin: '-20% 0px -35% 0px'
      }
    );

    this.timelineStepRefs.forEach((stepRef, index) => {
      stepRef.nativeElement.setAttribute('data-step-index', String(index));
      this.stepObserver?.observe(stepRef.nativeElement);
    });
  }
}
