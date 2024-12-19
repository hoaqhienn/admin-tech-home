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
    subheader: 'Trang chủ',
    path: '/',
    icon: 'ri:dashboard-fill',
    active: true,
  },
  {
    id: 'properties',
    subheader: 'Chung cư',
    icon: 'ri:building-fill',
    path: '/',
    active: true,
    items: [
      {
        name: 'Tòa nhà',
        pathName: 'buildings',
        path: paths.buildings,
      },
      {
        name: 'Tầng',
        pathName: 'floors',
        path: paths.floors,
      },
      {
        name: 'Căn hộ',
        pathName: 'apartments',
        path: paths.apartments,
      },
      {
        name: 'Tiện ích',
        pathName: 'facilities',
        path: paths.facilities,
      },
    ],
  },
  {
    id: 'residents',
    subheader: 'Cư dân',
    path: '/',
    icon: 'ic:outline-group',
    active: true,
    items: [
      {
        name: 'Danh sách cư dân',
        pathName: 'residents-card',
        path: paths.residents,
      },
      {
        name: 'Phương tiện',
        pathName: 'residents-vehicles',
        path: paths.vehicles,
      },
      {
        name: 'Thông báo',
        pathName: 'notifications',
        path: paths.notifications,
      },
      {
        name: 'Khiếu nại',
        pathName: 'complains',
        path: paths.complaints,
      },
    ],
  },

  {
    id: 'adsAndServices',
    subheader: 'Quảng cáo và dịch vụ',
    icon: 'ic:round-gradient',
    path: '/',
    active: true,
    items: [
      {
        name: 'Quảng Cáo',
        pathName: 'advertisement',
        path: paths.advertisements,
      },
      {
        name: 'Dịch vụ chung cư',
        pathName: 'services',
        path: paths.services,
      },
      {
        name: 'Dịch vụ bên ngoài',
        pathName: 'external-services',
        path: paths.externalServices,
      },
      {
        name: 'Nhà cung cấp dịch vụ',
        pathName: 'service-provider',
        path: paths.serviceProviders,
      },
    ],
  },
  {
    id: 'more',
    subheader: 'Khác',
    icon: 'ri:more-fill',
    path: '/',
    active: true,
    items: [
      {
        name: 'Hóa đơn',
        pathName: 'bills',
        path: paths.bills,
      },
      {
        name: 'Sự kiện',
        pathName: 'events',
        path: paths.events,
      },
      {
        name: 'Cài đặt',
        pathName: 'settings',
        path: paths.settings,
      },
      // {
      //   name: 'Báo cáo và phân tích',
      //   pathName: 'reports',
      //   path: paths.reports,
      // },
    ],
  },
];

export default sitemap;
