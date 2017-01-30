/**
 * Module dependencies
 */

/**
 * Load routes
 */

const apiProxy = require('./api-proxy');
const root = require('./root');

/**
 * Mount routes into app
 */

module.exports = (app) => {
  // api routes
  app.use(apiProxy(app).routes());
  app.use(apiProxy(app).allowedMethods());
  // root routes
  app.use(root(app).routes());
  app.use(root(app).allowedMethods());
};
