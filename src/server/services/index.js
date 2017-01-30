/**
 * Module dependencies
 */

/**
 * Import services
 */

const ApiClient = require('./api-client');

/**
 * Load services into app
 */

module.exports = (app) => {
  const services = {
    api: new ApiClient({
      url: app.context.config.apiURL,
      login: app.context.config.apiUsername,
      password: app.context.config.apiPassword
    })
  };
  // eslint-disable-next-line no-param-reassign
  app.context.services = services;
};
