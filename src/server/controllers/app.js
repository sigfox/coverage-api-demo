/* eslint no-param-reassign: ["error", { "props": false }] */
/**
 * Module dependencies
 */

const reactApp = require('./../helpers/react-app');

/**
 * Render React app
 */

exports.render = async (ctx) => {
  const apiClient = ctx.app.context.services.api;
  let userError = null;
  const appConfig = ctx.app.context.config;
  const config = {
    api: {
      url: appConfig.apiURL
    },
    googleApiKey: appConfig.GAMapsApiKey
  };
  const buildOptions = {config, hydrateOnClient: false, path: ctx.path };
  const { html, helmet, status, state, location } = await reactApp.build(buildOptions);

  ctx.status = status;
  if (location) return ctx.set('Location', location);
  ctx.set('Content-Type', 'text/html; charset=utf-8');
  await ctx.render('app', { html, helmet, status, state });
};

/**
 * Test for redirection
 */

exports.redirect = async (ctx, next) => {
  const apiClient = ctx.app.context.services.api;
  try {
    const { body: redirect } = await apiClient.get(`redirects/${encodeURIComponent(ctx.path)}`);
    ctx.status = redirect.code;
    ctx.set('Location', redirect.to);
  } catch (err) {
    if (!err.status) console.error(err);
    // do nothing everything is OK, redirection is not mandatory
    // best effort
    await next();
  }
};
