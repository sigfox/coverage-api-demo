import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const GMap = withGoogleMap( props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={props.zoom}
    defaultCenter={props.center}
    onClick={props.onMapClick}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
      />
    ))}
  </GoogleMap>
))

export default GMap;
