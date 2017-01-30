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

  state = {
    processing: false
  }

  localise = () => {
    const { currentPositionCallback = () => {} } = this.props;
    const localisation = new Promise((resolve, reject) => {
      this.setState({processing: true});
      if(navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      } else {
        reject({ message: 'Geolocation API is not supported in your browser.' });
      }
    });
    localisation
      .then(result => {
        this.setState({processing: false});
        currentPositionCallback(null, result);
      })
      .catch(error => {
        this.setState({processing: false});
        currentPositionCallback(error);
      })
  }

  render() {
    const { children, ...props } = this.props;
    const {processing} = this.state;
    delete props.currentPositionCallback;
    return (<Button {...props} onClick={this.localise} disabled={processing}>{processing ? 'processing...' : children}</Button>)
  }
}

export default GeolocationButton;
