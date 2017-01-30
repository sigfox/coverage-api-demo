import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default function Tab(props) {
  const { children, className, to, ...rest } = props;
  const classNames = classnames('tabs-bar--item', className);

  if (to) return (
    <Link
      className={classNames}
      activeClassName="tabs-bar--item__active"
      to={to} {...rest}
    >
      {children}
    </Link>
    );

  return <li className={classNames} {...rest}>{children}</li>
}
