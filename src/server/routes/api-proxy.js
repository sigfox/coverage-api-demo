
const Router = require('koa-router');

/**
 * Mount routes into app
 */

module.exports = (app) => {
  const controllers = app.context.controllers;
  const root = new Router();
  root.get('/api/predictions', controllers.api.getOne);
  root.post('/api/predictions', controllers.api.getBatch);
  return root;
};
