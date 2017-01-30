/* eslint no-param-reassign: ["error", { "props": false }] */
/**
 * Module dependencies
 */

/**
 * Middlewares
 */

const errorHandler = require('./error-handler');
const assets = require('./assets');
const Webpack = require('webpack');
const webpackConfig = require('./../../../webpack.config.js');
const compress = require('koa-compress');
const logger = require('koa-logger');
const templating = require('./templating');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const koaBody = require('koa-body');

/**
 * Mount middlewares into app
 */

exports.beforeRoutes = (app) => {
  // Mount webpack dev and hot reload middlewares
  if (app.context.config.env === 'development') {
    const middlewaresWebpack = require('koa-webpack');
    const compiler = new Webpack(webpackConfig);
    app.use(middlewaresWebpack({
      compiler,
      dev: {
        stats: { colors: true },
        publicPath: webpackConfig.output.publicPath
      }
    }));
  }
  app.use(koaBody());
  // Compress files
  app.use(compress());
  // Lookup Etag for conditional get
  app.use(conditional());
  // Set Etag header
  app.use(etag());
  // Serve assets
  app.use(assets(app));
  // Setup nunjunks template engine
  app.use(templating(`${__dirname}/../views`, { config: app.context.config }));
};

exports.first = (app) => {
  // Handle all errors
  app.use(errorHandler());
  // Log all requests
  app.use(logger());
};
