import React, { PropTypes } from 'react';

if (__CLIENT__) {
  require('./alert.scss');
}

const Alert = (props) => {
  const {
    className = '', type = 'info', title = '', text = '', small = false, xsmall = false, children, ...rest
  } = props;
  return (
    <div
      className={`alert alert--${type} ${className} ${small ? 'small' : ''} ${xsmall ? 'xsmall' : ''}`}
      {...rest}
      role="alert"
    >
      {title && <p className="alert__title">{title}</p>}
      {text && <p className="alert__text">{text}</p>}
      {children}
    </div>
  );
};

Alert.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
  small: PropTypes.bool,
  xsmall: PropTypes.bool
};

export default Alert;
