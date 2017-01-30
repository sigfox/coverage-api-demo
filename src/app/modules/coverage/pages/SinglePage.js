import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import PageSection from 'common/layout/PageSection';
import GeolocationButton from 'common/GeolocationButton';
import CoverageMeter from 'common/CoverageMeter';
import GoogleMap from 'common/GoogleMap';
import Button from 'common/Button';

import {geocode, checkCoverage, changeDeviceClass, changeDeviceUsage} from 'coverage';

class SinglePage extends Component {
  state = {
    address: ''
  }
  geocode = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch(geocode(this.state.address, (coords) => {
      console.log('coords', coords);
      dispatch(checkCoverage(coords))
    }))
  }
  onType = (e) => {
    this.setState({
      address: e.target.value
    })
  }
  changeDeviceClass = (e) => {
    this.props.dispatch(changeDeviceClass(e.target.value))
  }
  changeDeviceUsage = (e) =>(
    this.props.dispatch(changeDeviceUsage(e.target.value))
  )
  render(){
    const {coverage: {geocoding, coords, address, coverage}, deviceClass, deviceUsage} = this.props;
    console.log(deviceClass, deviceUsage)
    let markers = [];
    if(coords) {
      markers = [{
        position: coords,
        key: address
      }]
    }
    return (<PageSection className="singlePointPage">
      <h1>Single address</h1>
      <p>
        <GeolocationButton currentPositionCallback={(err, result) => console.log(err, result)}>Locate Me</GeolocationButton>
        <em>Works best on mobile phones</em>
      </p>
      <p>&nbsp;</p>
      <p>Or enter an address here :</p>
      <p>
        <form onSubmit={this.geocode}>
          <input type="text" value={this.state.address} onChange={this.onType}
          /> <Button type="submit" onClick={this.geocode} disabled={geocoding}>{geocoding ? 'Processing...' : 'Test this address'}</Button>
        </form>
      </p>
      <div className="device-config">
      <label>
        Device class <select value={deviceClass} onChange={this.changeDeviceClass}>
          <option value={0}> 0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        </label> <label>Device Usage <select value={deviceUsage} onChange={this.changeDeviceUsage}>
    <option value="outdoor">outdoor</option>
    <option value="indoor">indoor</option>
    <option value="deepIndoor">deep indoor</option>
  </select></label>
      </div>
      {coverage &&
        <div>
        <p>Signal strength and robustness :
        <CoverageMeter margins={coverage.margins} objectClass={deviceClass} usage={deviceUsage} />
        </p>
        </div>}
      <div>
        {coords && <GoogleMap
          onMapLoad={() => {}}
          markers={markers}
          zoom={15}
          center={coords}
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: `100%` }} /> }
          />}
      </div>
    </PageSection>)
  }
}

export default connect(state => ({
  coverage: state.coverage.singleCoverage,
  deviceClass: state.coverage.deviceClass,
  deviceUsage: state.coverage.deviceUsage
}))(SinglePage);
