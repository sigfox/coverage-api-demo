/**
 * Module dependencies
 */

const api = require('./api');
const app = require('./app');

/**
 * Load controllers into app
 */

module.exports = (koaApp) => {
  const controllers = {
    api,
    app
  };
  // eslint-disable-next-line no-param-reassign
  koaApp.context.controllers = controllers;
};
