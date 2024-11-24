export const rootPaths = {
  root: '/',
  authRoot: 'auth',
  errorRoot: 'error',
  propertiesRoot: 'properties',
  residentsRoot: 'residents',
  moreRoot: 'more',
};

export default {
  settings: `/${rootPaths.moreRoot}/settings`,
  reportStatistics: `/${rootPaths.moreRoot}/report-statistics`,

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
  overview: `/${rootPaths.propertiesRoot}/overview`,
};
