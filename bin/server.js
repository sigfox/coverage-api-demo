'use strict'; // eslint-disable-line strict
const fs = require('fs');
const path = require('path');
const register = require('babel-register');

global.__PROJECT_ROOT = path.resolve(`${__dirname}/../`);

// Enable runtime transpilation to some features of ES6/7 and JSX in node
const babelrc = fs.readFileSync('.babelrc');
let config;
try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}
register(config);

require('../src/server');
