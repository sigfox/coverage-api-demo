import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants';
import getDataDependencies from '../helpers/getDataDependencies';

const locationsAreEqual = (locA, locB) => (locA.pathname === locB.pathname) && (locA.search === locB.search);

export default ({ getState, dispatch }) => next => action => {
  if (action.type === ROUTER_DID_CHANGE) {
    if (getState().router && locationsAreEqual(action.payload.location, getState().router.location)) {
      // if you remove this (because you want to force reloading) you break reconciliation
      // between server-rendered markup and client first render (everything gets re-fetched and re-rendered)
      return next(action);
    }

    const { components, location, params } = action.payload;
    const promise = new Promise((resolve) => {
      const doTransition = () => {
        const promises = getDataDependencies(components, getState, dispatch, location, params, true);
        // Calling the fetchDataDeferred first allow the REQUEST type ("api") action to be dispatched
        // before the page component is mounted
        next(action);
        Promise.all(promises)
          .then(resolve, resolve);
      };

      Promise.all(getDataDependencies(components, getState, dispatch, location, params))
        .then(doTransition, doTransition);
    });

    if (__SERVER__) {
      // router state is null until ReduxRouter is created so we can use this to store
      // our promise to let the server know when it can render
      // eslint-disable-next-line no-param-reassign
      getState().router = promise;
    }

    return promise;
  }

  return next(action);
};
