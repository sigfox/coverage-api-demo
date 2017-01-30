import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { reducer as app } from './common';
import { reducer as coverage } from 'coverage';
export default combineReducers({
  app,
  router,
  coverage,
  config: (state = {}) => state
});
