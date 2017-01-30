import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

/**
 * This silly underscore is here to avoid a mysterious
 * "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(config = {}) {
    this.config = config;
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](this.formatUrl(path));
        if (__CLIENT__) {
          request.withCredentials();
        }

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && config.cookie) {
          request.set('cookie', config.cookie);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, res = {}) => err ? reject(res.body || err, res) : resolve(res.body, res));
      });
    });
  }
  formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? `/${path}` : path;
    // Prepend `/api` to relative URL, to proxy to API server.
    const apiPath = `/api${adjustedPath}`;
    if (__SERVER__) {
      // Prepend host and port of the API server to the path.
      return `${this.config.url}${apiPath}`;
    }
    return apiPath;
  }
}

const ApiClient = _ApiClient;

export const createApiClient = (config) => new ApiClient(config);

