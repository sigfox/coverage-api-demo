import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import PageSection from 'common/layout/PageSection';
import GeolocationButton from 'common/GeolocationButton';
import CoverageMeter from 'common/CoverageMeter';
import GoogleMap from 'common/GoogleMap';
import Button from 'common/Button';

import {geocode, checkCoverage} from 'coverage';

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
  render(){
    const {coverage: {geocoding, coords, address, coverage}} = this.props;
    let markers = [];
    if(coords) {
      markers = [{
        position: coords,
        key: address
      }]
    }
    return (<PageSection className="singlePointPage">
      <h1>Single point</h1>
      <p>
        <GeolocationButton currentPositionCallback={(err, result) => console.log(err, result)}>Locate Me</GeolocationButton>
        <em>Works best on mobile phones</em>
      </p>
      <p>Or enter an address here :</p>
      <p>
        <form onSubmit={this.geocode}>
          <input type="text" value={this.state.address} onChange={this.onType} />
          <Button type="submit" onClick={this.geocode} disabled={geocoding}>{geocoding ? 'Processing...' : 'Test this address'}</Button>
        </form>
      </p>
      {coverage && <CoverageMeter margins={coverage.margins} objectClass={0} usage="indoor" />}
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

export default connect(state => ({coverage: state.coverage.singleCoverage}))(SinglePage);
