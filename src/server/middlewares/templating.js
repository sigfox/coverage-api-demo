/**
 * Module dependencies
 */

const nunjucks = require('nunjucks');

/**
 * Configure nunjucks template engine
 */

module.exports = (path, globals) => {
  const env = nunjucks.configure([path]);
  Object.keys(globals).forEach((key) => env.addGlobal(key, globals[key]));

  return async (ctx, next) => {
    if (ctx.render) return await next();
    // eslint-disable-next-line no-param-reassign
    ctx.render = (relPath, locals = {}) => {
      const promise = new Promise((resolve, reject) => {
        env.render(`${relPath}.njk`, locals, (err, html) => {
          if (err) return reject(err);
          ctx.set('Content-Type', 'text/html; charset=utf-8');
          // eslint-disable-next-line no-param-reassign
          ctx.body = html;
          resolve();
        });
      });
      return promise;
    };
    await next();
  };
};
