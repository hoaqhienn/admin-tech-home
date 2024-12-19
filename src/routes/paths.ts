export const rootPaths = {
  root: '/',
  authRoot: 'auth',
  errorRoot: 'error',

  buildingRoot: 'buildings',
  floorRoot: 'floors',
  apartmentRoot: 'apartments',
  facilityRoot: 'facilities',

  residentsRoot: 'residents',
  vehiclesRoot: 'vehicles',
  notificationsRoot: 'notifications',
  complaintsRoot: 'complaints',

  billsRoot: 'bills',
  eventsRoot: 'events',
  servicesRoot: 'services',
  settingsRoot: 'settings',
  reportsRoot: 'reports',

  homeRoot: 'home',
};

export default {
  404: `/${rootPaths.errorRoot}/404`,
  chat: `/${rootPaths.root}/chat`,

  signin: `/${rootPaths.authRoot}/signin`,

  buildings: `/${rootPaths.buildingRoot}`,
  floors: `/${rootPaths.floorRoot}`,
  apartments: `/${rootPaths.apartmentRoot}`,
  apartmentDetail: `/${rootPaths.apartmentRoot}/:id`,
  facilities: `/${rootPaths.facilityRoot}`,

  residents: `/${rootPaths.residentsRoot}`,
  addResident: `/${rootPaths.residentsRoot}/add`,

  vehicles: `/${rootPaths.vehiclesRoot}`,
  notifications: `/${rootPaths.notificationsRoot}`,
  complaints: `/${rootPaths.complaintsRoot}`,

  bills: `/${rootPaths.billsRoot}`,
  events: `/${rootPaths.eventsRoot}`,
  services: `/${rootPaths.servicesRoot}`,
  settings: `/${rootPaths.settingsRoot}`,
  reports: `/${rootPaths.reportsRoot}`,

  home: `/${rootPaths.root}/home`,

  externalServices: `/${rootPaths.servicesRoot}/external`,
  internalServices: `/${rootPaths.servicesRoot}/internal`,
  advertisements: `/${rootPaths.servicesRoot}/advertisements`,
  serviceProviders: `${rootPaths.servicesRoot}/service-provider`,
};
