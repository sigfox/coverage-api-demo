import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import App from './app';

import qs from 'qs';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { useRouterHistory } from 'react-router';
import { reduxReactRouter, ReduxRouter } from 'redux-router';

import createStore from '../app/helpers/createStore';
import { createApiClient } from '../app/helpers/createApiClient';

const clientConfig = window.__CLIENT_CONFIG__;
const apiClient = createApiClient({});

const store = createStore(
  reduxReactRouter,
  null,
  () => useRouterHistory(useScroll(createBrowserHistory))({
    parseQueryString: qs.parse,
    stringifyQuery: (args) => qs.stringify(args, { encode: false })
  }),
  { api: apiClient },
  window.__INITIAL_STATE__ || {}
);

const component = (
  <AppContainer>
    <App store={store} />
  </AppContainer>
);

render(component, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app');
    render(
      <AppContainer>
       <NextApp store={store} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
