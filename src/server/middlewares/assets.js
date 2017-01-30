/**
 * Module dependencies
 */

const serve = require('koa-static');
const Router = require('koa-router');
const path = require('path');
const mount = require('koa-mount');

/**
 * Serve public files
 */

module.exports = (app) => {
  const router = new Router();
  const assetsPath = path.normalize(`${__dirname}/../../../${app.context.config.buildPath}/`);
  router.get('/assets/*', mount('/assets', serve(assetsPath, { gzip: false })));
  return router.routes();
};
