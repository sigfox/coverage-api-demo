import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import transitionMiddleware from '../middleware/routerTransitionsMiddleware';
import apiClientMiddleware from '../middleware/apiClientMiddleware';
import geocoderMiddleware from '../middleware/geocoderMiddleware';

// eslint-disable-next-line max-len
export function createStore(reduxReactRouter, getRoutes, createHistory, clients = {}, initialData = {}) {
  const middleware = [
    apiClientMiddleware(clients.api),
    geocoderMiddleware(),
    thunkMiddleware,
    transitionMiddleware
  ];
  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )(_createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware(...middleware)
    )(_createStore);
  }
  finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);
  const reducer = require('../modules/reducer');
  const store = finalCreateStore(reducer, initialData);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('../modules/reducer', () => {
      store.replaceReducer(require('../modules/reducer'));
    });
  }

  return store;
}

export default createStore;
