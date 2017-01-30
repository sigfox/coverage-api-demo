import React, { PropTypes, Component } from 'react';

import { getRoutes as coverageRoutes } from 'coverage';

if (__CLIENT__) {
  require('./assets/style.scss');
}

class MainComponent extends Component {

  render() {
      const { routes = [] } = this.props;
      const pageNames = routes.map(r => r.name || '').join(' ').trim();

      return (
        <div
          id="app-wrapper"
        >
          <div id="page-wrapper">
            {this.props.children}
          </div>
        </div>
      );
    }
}

export const component = MainComponent;
export function getChildRoutes({ dispatch, getState }) {
  return [
    coverageRoutes({dispatch, getState})
  ];
}

