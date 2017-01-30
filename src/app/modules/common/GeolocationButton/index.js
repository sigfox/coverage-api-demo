import React, { PropTypes, Component } from 'react';
import Button from '../Button';

/**
 * A generic geolocation button.
 */
class GeolocationButton extends Component {
  static propTypes = {
    /**
     * The button contents
     */
    children: PropTypes.node.isRequired,
    /**
     * Current position callback (error, value) => (do something)
     */
    currentPositionCallback: PropTypes.func.isRequired
  }

  localise = () => {
    const { currentPositionCallback = () => {} } = this.props;
    const localisation = new Promise((resolve, reject) => {
      if(navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      } else {
        reject({ message: 'Geolocation API is not supported in your browser.' });
      }
    });
    localisation
      .then(result => {
        currentPositionCallback(null, result);
      })
      .catch(error => currentPositionCallback(error))
  }

  render() {
    const { children, ...props } = this.props;
    delete props.currentPositionCallback;
    return (<Button {...props} onClick={this.localise}>{children}</Button>)
  }
}

export default GeolocationButton;
