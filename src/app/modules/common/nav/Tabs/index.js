import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import aTab from './tab';

if (__CLIENT__) {
  require('./tabs.scss');
}

class TabBar extends Component {
  render(){
    const {className, children, centered, ...rest} = this.props;
    const classNames = classnames(
      'tabs-bar', className, {'tabs-bar__centered': centered});
    return (<nav className={classNames} {...rest}>
      {children}
    </nav>)
  }
}

export const Tab = aTab;
export const Tabs = TabBar;
export default Tabs;
