import React, { PropTypes } from 'react';
import classNames from 'classnames';

if (__CLIENT__) {
  require('./page-section.scss');
}

function PageSection({ className = '', children, title, variant = '', withoutClear, relatedSection, ...props }) {
  const componentClassName = classNames(className, {
    'page-section': true,
    [`page-section--${variant}`]: !!variant,
    'page-section--without-clear': !!withoutClear,
    'page-section--related-section': !!relatedSection
  });
  return (
    <section className={componentClassName} {...props}>
      {!!relatedSection && <span className="page-section--related-section__top"><span className="arrow" /></span>}
      {!!title && <h2 className="sectionTitle">{title}</h2>}
      <div className="section-inner">
      {children}
      </div>
    </section>
  );
}

PageSection.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  relatedSection: PropTypes.bool,
  withoutClear: PropTypes.bool,
  title: PropTypes.node
};

export default PageSection;
