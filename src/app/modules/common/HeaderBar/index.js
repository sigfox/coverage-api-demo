import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

if (__CLIENT__) {
  require('./header-bar.scss');
}

class HeaderBar extends Component {
  state = {
    menuOpened: false
  };

  toggleMenu = (opened) => {
    this.setState({ menuOpened: opened });
  };

  render() {
    const { className = '', ...props } = this.props;
    const classNames = classnames('header-bar', className, {
      'header-bar-opened': this.state.menuOpened
    });

    return (
      <div className={classNames} {...props}>
        <div className="section-inner">
          <div className="header-logo">
            <Link to="/" className="logo">Home</Link>
          </div>
          {props.children}
        </div>
      </div>
    );
  }
}

HeaderBar.propTypes = {
  className: PropTypes.string
};

export default HeaderBar;
