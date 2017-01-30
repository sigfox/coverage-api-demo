const app = {};
import { component, getChildRoutes } from './modules/main';

export function getRoutes({ dispatch, getState }) {
  return {
    path: '/',
    component,
    childRoutes: getChildRoutes({ dispatch, getState }),
    indexRoute: { onEnter: (nextState, replace) => replace('/single') },
  };
}
export default app;
