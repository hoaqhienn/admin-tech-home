import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'ri:dashboard-fill',
    active: true,
  },
  {
    id: 'properties',
    subheader: 'Properties',
    icon: 'ri:building-fill',
    path: '/',
    active: true,
    items: [
      {
        name: 'Overview',
        pathName: 'overview',
        path: paths.overview,
      },
      {
        name: 'Buildings',
        pathName: 'buildings',
        path: paths.buildings,
      },
      {
        name: 'Floors',
        pathName: 'floors',
        path: paths.floors,
      },
      {
        name: 'Apartments',
        pathName: 'apartments',
        path: paths.apartments,
      },
    ],
  },
  {
    id: 'residents',
    subheader: 'Residents',
    path: '/',
    icon: 'ic:outline-group',
    active: true,
    items: [
      {
        name: 'Residents Management',
        pathName: 'residents-card',
        path: paths.residents,
      },
      {
        name: 'Requests & Recommendations',
        pathName: 'requests-and-recommendations',
        path: '/',
      },
      {
        name: 'Vehicles',
        pathName: 'residents-vehicles',
        path: '/',
      },
    ],
  },
  {
    id: 'more',
    subheader: 'More',
    icon: 'ri:more-fill',
    active: true,
    items: [
      {
        name: 'Events',
        pathName: 'events',
        path: paths.events,
      },
      {
        name: 'Services & Advertisements',
        pathName: 'services',
        path: paths.services,
      },
      {
        name: 'Reports & Statistics',
        pathName: 'settings',
        path: paths.reportStatistics,
      },
      {
        name: 'Settings',
        pathName: 'settings',
        path: paths.settings,
      },
    ],
  },
];

export default sitemap;
