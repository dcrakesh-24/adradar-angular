export interface HelpCenterNavItem {
  label: string;
  path?: string;
  children?: HelpCenterNavItem[];
}

export const HELP_CENTER_NAV_ITEMS: HelpCenterNavItem[] = [
  { label: 'Adradar', path: 'adradar' },
  { label: 'LinkedIn Integrations', path: 'linkedin-integrations' },
  {
    label: 'CRM Integration',
    children: [
      { label: 'HubSpot', path: 'crm-integration/hubspot' },
      { label: 'Salesforce', path: 'crm-integration/salesforce' },
      { label: 'Adradar Dashboards', path: 'crm-integration/adradar-dashboards' }
    ]
  },
  {
    label: 'ABM Settings',
    children: [
      { label: 'Journey Stages', path: 'abm-settings/journey-stages' },
      { label: 'Account Scoring', path: 'abm-settings/account-scoring' },
      { label: 'Revenue Attribution', path: 'abm-settings/revenue-attribution' }
    ]
  },
  {
    label: 'Company Insights Dashboards',
    path: 'abm-settings/company-insights-dashboards'
  },
  {
    label: 'Campaign Insights',
    path: 'abm-settings/campaign-insights'
  }
];

