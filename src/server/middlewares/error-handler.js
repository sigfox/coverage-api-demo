/* eslint no-param-reassign: ["error", { "props": false }] */
/**
 * Module dependencies
 */

/**
 * Handle errors
 */

module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    if (ctx.request.accepts('html') && ctx.render) {
      try { await ctx.render('500'); } catch (e) { console.error(e); }
    }
    ctx.app.emit('error', err);
  }
};
