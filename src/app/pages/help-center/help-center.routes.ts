import { Routes } from '@angular/router';
import { HelpCenterLayoutComponent } from './help-center-layout.component';
import { HelpCenterArticleComponent } from './help-center-article.component';

export const HELP_CENTER_ROUTES: Routes = [
  {
    path: '',
    component: HelpCenterLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'adradar'
      },
      {
        path: 'quickstart-guide',
        component: HelpCenterArticleComponent,
        data: {
          category: 'Getting Started',
          title: 'Quickstart: Track Website Visitors with Recotap',
          onThisPage: [
            'Prerequisites',
            'Install Tracking Script',
            'Identify Users',
            'Track Custom Events',
            'Verify Installation',
            'Common Errors',
            'Next Steps'
          ]
        }
      },
      {
        path: 'install-via-google-tag-manager',
        component: HelpCenterArticleComponent,
        data: {
          category: 'Getting Started',
          title: 'Install via Google Tag Manager',
          onThisPage: [
            'Add Recotap Tag',
            'Configure Triggers',
            'Publish Container',
            'Verify Installation'
          ]
        }
      },
      {
        path: 'prerequisites',
        component: HelpCenterArticleComponent,
        data: {
          category: 'Getting Started',
          title: 'Prerequisites',
          onThisPage: [
            'Account Requirements',
            'Codebase Access',
            'Permissions Checklist'
          ]
        }
      },
      {
        path: 'core-concepts',
        component: HelpCenterArticleComponent,
        data: {
          category: 'Core Concepts',
          title: 'Core Concepts',
          onThisPage: [
            'Tracking Script',
            'Events & Properties',
            'Accounts & Users'
          ]
        }
      },
      {
        path: 'troubleshooting',
        component: HelpCenterArticleComponent,
        data: {
          category: 'Troubleshooting',
          title: 'Troubleshooting',
          onThisPage: [
            'No Visitors Detected',
            'Script Not Loading',
            'Event Delivery Issues'
          ]
        }
      }
      ,
      {
        path: 'adradar',
        component: HelpCenterArticleComponent,
        data: {
          category: 'Adradar',
          title: 'Adradar Overview',
          onThisPage: ['What is AdRadar?', 'Key capabilities of AdRadar']
        }
      },
      {
        path: 'linkedin-integrations',
        component: HelpCenterArticleComponent,
        data: {
          category: 'LinkedIn Integrations',
          title: 'LinkedIn Integrations',
          onThisPage: ['Prerequisites', 'Connecting LinkedIn', 'Syncing Data']
        }
      },
      {
        path: 'crm-integration/hubspot',
        component: HelpCenterArticleComponent,
        data: {
          category: 'CRM Integration',
          title: 'HubSpot Integration',
          onThisPage: ['Connect HubSpot', 'Sync Settings', 'Troubleshooting']
        }
      },
      {
        path: 'crm-integration/salesforce',
        component: HelpCenterArticleComponent,
        data: {
          category: 'CRM Integration',
          title: 'Salesforce Integration',
          onThisPage: ['Connect Salesforce', 'Field Mapping', 'Troubleshooting']
        }
      },
      {
        path: 'crm-integration/adradar-dashboards',
        component: HelpCenterArticleComponent,
        data: {
          category: 'CRM Integration',
          title: 'Adradar Dashboards',
          onThisPage: ['Available Dashboards', 'Customizing Views']
        }
      },
      {
        path: 'abm-settings/journey-stages',
        component: HelpCenterArticleComponent,
        data: {
          category: 'ABM Settings',
          title: 'Journey Stages',
          onThisPage: ['Stage Model', 'Configuring Stages']
        }
      },
      {
        path: 'abm-settings/account-scoring',
        component: HelpCenterArticleComponent,
        data: {
          category: 'ABM Settings',
          title: 'Account Scoring',
          onThisPage: ['Score Model', 'Signals', 'Tuning Scores']
        }
      },
      {
        path: 'abm-settings/revenue-attribution',
        component: HelpCenterArticleComponent,
        data: {
          category: 'ABM Settings',
          title: 'Revenue Attribution',
          onThisPage: ['Attribution Models', 'Configuring Attribution']
        }
      },
      {
        path: 'abm-settings/company-insights-dashboards',
        component: HelpCenterArticleComponent,
        data: {
          category: 'ABM Settings',
          title: 'Company Insights Dashboards',
          onThisPage: ['Overview Widgets', 'Filters']
        }
      },
      {
        path: 'abm-settings/campaign-insights',
        component: HelpCenterArticleComponent,
        data: {
          category: 'ABM Settings',
          title: 'Campaign Insights',
          onThisPage: ['Performance Views', 'Diagnostics']
        }
      }
    ]
  }
];

