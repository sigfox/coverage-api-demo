import React, { PropTypes } from 'react';

if (__CLIENT__) {
  require('./nav.scss');
}

function Nav(props) {
  const { className = '', ...rest } = props;
  return <nav className={`nav ${className}`} {...rest} />;
}

Nav.propTypes = {
  className: PropTypes.string
};

export default Nav;
