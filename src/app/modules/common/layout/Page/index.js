import React, { PropTypes } from 'react';

if (__CLIENT__) {
  require('./page.scss');
}

function Page({ className, children, ...props }) {
  const componentClassName = className ? `page ${className}` : 'page';
  return (
    <div className={componentClassName} {...props}>
      {children}
    </div>
  );
}

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Page;
