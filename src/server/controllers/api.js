/* eslint no-param-reassign: ["error", { "props": false }] */
/**
 * Module dependencies
 */

const reactApp = require('./../helpers/react-app');

/**
 * Render React app
 */

exports.getOne = async (ctx, next) => {
  const apiClient = ctx.app.context.services.api;
  const respBody = await apiClient.get(`predictions${ctx.search}`);
  ctx.set('Content-Type', 'application/json; charset=utf-8');
  ctx.body = respBody.text;
};

/**
 * Test for redirection
 */

exports.getBatch = async (ctx, next) => {
  const apiClient = ctx.app.context.services.api;
  const respBody = await apiClient.post(`predictions`).send(ctx.request.body);
  ctx.set('Content-Type', 'application/json; charset=utf-8');
  ctx.body = respBody.text;
};
