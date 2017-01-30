import React, { PropTypes } from 'react';

if (__CLIENT__) {
  require('./content.scss');
}

function Content(props) {
  const { className = '', ...rest } = props;
  return <div className={`content ${className}`} {...rest} />;
}

Content.propTypes = {
  className: PropTypes.string
};

export default Content;
