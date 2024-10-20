export const rootPaths = {
  root: '/',
  pageRoot: 'pages',
  authRoot: 'auth',
  errorRoot: 'error',
  propertiesRoot: 'properties',
  residentsRoot: 'residents',
  moreRoot: 'more',
};

export default {
  dashboard: `/${rootPaths.pageRoot}/dashboard`,
  activity: `/${rootPaths.pageRoot}/activity`,
  library: `/${rootPaths.pageRoot}/library`,
  schedules: `/${rootPaths.pageRoot}/schedules`,
  payouts: `/${rootPaths.pageRoot}/payouts`,
  settings: `/${rootPaths.pageRoot}/settings`,

  signin: `/${rootPaths.authRoot}/signin`,
  signup: `/${rootPaths.authRoot}/signup`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  404: `/${rootPaths.errorRoot}/404`,
  buildings: `/${rootPaths.propertiesRoot}/buildings`,
  floors: `/${rootPaths.propertiesRoot}/floors`,
  apartments: `/${rootPaths.propertiesRoot}/apartments`,
  events: `/${rootPaths.moreRoot}/events`,
  services: `/${rootPaths.moreRoot}/services`,
  residents: `/${rootPaths.residentsRoot}/residents`,
};
