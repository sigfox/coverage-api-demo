import React, { PropTypes } from 'react';

if (__CLIENT__) {
  require('./nav-item.scss');
}

function TabItem(props) {
  const { active, className = '', ...rest } = props;
  const isActive = active;
  return <div className={`tab-item ${isActive ? 'tab-item--active' : ''} ${className}`} {...rest} />;
}

TabItem.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string
};

export default TabItem;
