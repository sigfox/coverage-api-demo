import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import _ from 'lodash';

if (__CLIENT__) {
  require('./button.scss');
}

const propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  inverted: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func
};

const Button = (props) => {
  const {
    type = 'button', className = '', children = null, size = '',
    variant = 'purple', inverted = false, onClick, disabled, to,
    ...rest
  } = props;
  // only pass valid attributes to html element
  const restBtnAttr = _.pick(rest, ['onHover', 'onMouseDown', 'onMouseUp', 'value', 'onMouseEnter', 'onMouseLeave']);
  const finalClassName = ['btn', `btn-${variant}`, className];

  if (size) finalClassName.push(`btn-${size}`);
  if (inverted) finalClassName.push('btn-inverted');
  if (disabled) finalClassName.push('btn-disabled');
  if ((type === 'link' && to) || type === 'href') {
    const onDisabledLink = (e) => {
      if (disabled) {
        e.preventDefault();
      } else if (onClick) {
        onClick(e);
      }
    };
    return type === 'link' ? (
      <Link className={finalClassName.join(' ')} to={to} {...rest} onClick={onDisabledLink}>
        {children}
      </Link>
    ) : (
      <a className={finalClassName.join(' ')} {...rest} onClick={onDisabledLink}>
        {children}
      </a>
    );
  }
  return (
    <button className={finalClassName.join(' ')} type={type} onClick={onClick} disabled={disabled} {...restBtnAttr}>
      {children}
    </button>
  );
};

Button.propTypes = propTypes;

export default Button;
