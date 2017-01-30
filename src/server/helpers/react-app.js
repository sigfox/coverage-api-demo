/**
 * Module dependencies
 */

import { match, reduxReactRouter } from 'redux-router/server';
import { ReduxRouter } from 'redux-router';

import React from 'react';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import createStore from '../../app/helpers/createStore';
import { getRoutes } from '../../app';
import createHistory from 'history/lib/createMemoryHistory';
import qs from 'qs';

import createApiClient from '../../app/helpers/createApiClient';
/**
 * Utilities
 */

function buildStore(initialState) { // eslint-disable-line no-shadow
  const apiClient = createApiClient(initialState.config.api);
  return createStore(
    reduxReactRouter,
    getRoutes,
    createHistory,
    { api: apiClient },
    initialState
  );
}

function render(path, initialState, hydrateOnClient) { // eslint-disable-line no-shadow
  if (true) {
    return Promise.resolve({ html: '', state: initialState, status: 200 });
  }
  const store = buildStore(initialState);
  return new Promise((resolve, reject) => {
    store.dispatch(match(path, (error, redirectLocation, routerState) => {
      if (error) {
        return reject(error);
      } else if (redirectLocation) {
        return resolve({ state: null, status: 302, location: redirectLocation });
      } else if (routerState) {
        if (routerState.location.search && !routerState.location.query) {
          // TODO check with Fred why we need to do that
          // eslint-disable-next-line no-param-reassign
          routerState.location.query = qs.parse(routerState.location.search);
        }
        store.getState().router
          .then(() => {
            const storeState = store.getState();
            const Component = (
              <Provider store={store} key="provider">
                <ReduxRouter />
              </Provider>
            );
            const html = renderToString(Component);
            const helmet = Helmet.rewind();
            return resolve({ html, helmet, state: storeState, status: store.getState().app.status || 200 });
          })
          .catch((err) => reject(err));
      }
    }));
  });
}


/**
 * Build React app
 */

exports.build = ({ path, config, hydrateOnClient }) => {
  const initialState = {
    config
  };

  return render(path, initialState, hydrateOnClient);
};
