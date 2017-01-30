/**
 * Module dependencies
 */

const Router = require('koa-router');

/**
 * Mount routes into app
 */

module.exports = (app) => {
  const controllers = app.context.controllers;
  const root = new Router();
  root.get('/*', controllers.app.redirect, controllers.app.render);

  return root;
};
