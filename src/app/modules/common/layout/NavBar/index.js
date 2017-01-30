import React, { PropTypes } from 'react';

if (__CLIENT__) {
  require('./nav-bar.scss');
}

const NavBar = (props) => {
  const { className = '', ...rest } = props;
  return <nav className={`nav-bar ${className}`} {...rest} />;
};

NavBar.propTypes = {
  className: PropTypes.string
};

export default NavBar;
