/**
 * Module dependencies
 */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const request = require('superagent');

/**
 * ApiClient
 */

class ApiClient {
  constructor(options) {
    this.url = options.url;
    this.login = options.login;
    this.password = options.password;
  }
  get(path, query) {
    return request
      .get(`${this.url}/${path}`)
      .auth(this.login, this.password)
      .query(query || '');
  }
  post(path) {
    return request.post(`${this.url}/${path}`).auth(this.login, this.password).type('json');
  }
  put(path) {
    return request.put(`${this.url}/${path}`);
  }
  del(path) {
    return request.del(`${this.url}/${path}`);
  }
  patch(path) {
    return request.patch(`${this.url}/${path}`);
  }
}

module.exports = ApiClient;
