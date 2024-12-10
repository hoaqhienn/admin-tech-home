export const rootPaths = {
  root: '/',
  authRoot: 'auth',
  moreRoot: 'more',
  errorRoot: 'error',
  residentsRoot: 'residents',
  propertiesRoot: 'properties',
};

export default {
  404: `/${rootPaths.errorRoot}/404`,

  signin: `/${rootPaths.authRoot}/signin`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,

  floors: `/${rootPaths.propertiesRoot}/floors`,
  buildings: `/${rootPaths.propertiesRoot}/buildings`,
  apartments: `/${rootPaths.propertiesRoot}/apartments`,
  facilities: `/${rootPaths.propertiesRoot}/facilities`,

  complaints: `/${rootPaths.residentsRoot}/complaints`,
  residents: `/${rootPaths.residentsRoot}/residents`,
  vehicles: `/${rootPaths.residentsRoot}/vehicles`,

  bills: `/${rootPaths.moreRoot}/bills`,
  events: `/${rootPaths.moreRoot}/events`,
  settings: `/${rootPaths.moreRoot}/settings`,
  services: `/${rootPaths.moreRoot}/services`,
  notifications: `/${rootPaths.moreRoot}/notifications`,
  reportStatistics: `/${rootPaths.moreRoot}/report-statistics`,

  chat: `/${rootPaths.root}/chat`,
};
