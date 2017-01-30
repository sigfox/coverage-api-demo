/**
 * Module dependencies
 */

const Koa = require('koa');
const http = require('http');
const superconsole = require('superconsole');
const figc = require('figc');
const fs = require('fs');

/**
 * Load configuration
 */

const env = process.env.NODE_ENV || 'development';
const configFile = env !== 'development' ? `config.${env}.json` : 'config.json';
const config = figc(`${__dirname}/${configFile}`);
config.env = env;
config.port = process.env.PORT || config.port;
config.logLevel = process.env.LOG_LEVEL || config.logLevel;
config.publicURL = process.env.PUBLIC_URL || config.publicURL;
config.apiURL = process.env.API_URL || config.apiURL;
config.version = process.env.APP_VERSION || fs.readFileSync(`${__dirname}/../../.version`).toString().trim();

/**
 * Setup global vars for React/Redux app
 */

global.__VERSION__ = config.version;
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = config.env === 'development';
global.__DEVTOOLS__ = false;
global.__ENV__ = config.env;

/**
 * Setup logging
 */

superconsole({
  callsite: true,
  level: true,
  timestamp: true,
  logLevel: config.logLevel
});

/**
 * Application dependencies
 */

const controllers = require('./controllers');
const middlewares = require('./middlewares');
const services = require('./services');
const routes = require('./routes');

/**
 * Setup application
 */

const app = new Koa();

// Print Koa app errors
app.on('error', (err) => console.error(err));

// Mount error handler and other middlewares
middlewares.first(app);

// Set configuration
app.context.config = config;

// Set controllers
controllers(app);

// Set services
services(app);


// Mount middlewares
middlewares.beforeRoutes(app);

// Mount routes
routes(app);

/**
 * Setup HTTP server
 */

const server = http.createServer(app.callback());
server.listen(app.context.config.port, (err) => {
  if (err) return console.error(err);
  console.info(`Front server is listening on port ${app.context.config.port}`);
  console.info(`Using configuration: ${JSON.stringify(app.context.config)}`);
  if (process.send) process.send('ready');
});


/**
 * Handle signal to stop the server gracefully
 */

process.on('SIGTERM', () => {
  console.info('Received SIGTERM signal, closing server before exit...');
  // TODO clean up database connections, set intervals ...
  server.close(() => {
    console.info('Server closed');
    process.exit(0);
  });
});

/**
 * Handle globals error
 */

process.on('uncaughtException', (err) => {
  console.error(new Error('Uncaught exception catched, see next error'));
  console.error(err, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(new Error('Unhandled rejection catched, see next error'));
  console.error(err, err.message);
  process.exit(1);
});
