import React from 'react';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import { Provider } from 'react-redux';
import { getRoutes } from '../app';

export default function App(props) {
  return (<Provider store={props.store} key="provider">
    <ReduxRouter routes={[getRoutes({ dispatch: props.store.dispatch, getState: props.store.getState })]} />
  </Provider>);
}
