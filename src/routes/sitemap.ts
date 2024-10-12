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
        name: 'Buildings',
        pathName: 'buildings',
        path: '/',
      },
      {
        name: 'Floors',
        pathName: 'floors',
        path: '/',
      },
      {
        name: 'Apartments',
        pathName: 'apartments',
        path: '/',
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
        path: '/',
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
        name: 'Advertisements',
        pathName: 'advertisements',
        path: '/',
      },
      {
        name: 'Service',
        pathName: 'service',
        path: '/',
      },
      {
        name: 'Settings',
        pathName: 'settings',
        path: '/',
      }
    ],
  },
];

export default sitemap;
