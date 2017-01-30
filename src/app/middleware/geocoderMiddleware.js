export default function geocoderMiddleware(){
  let geocoder;
  return ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    const { type, types, resolve, reject, ...rest } = action; // eslint-disable-line no-redeclare
    if (type !== 'geocode') {
      return next(action);
    }

    if( !geocoder && window.google) {
      geocoder = new google.maps.Geocoder();
    }

    const _resolve = resolve || (() => {});
    const _reject = reject || (() => {});

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    if (geocoder) {
      geocoder.geocode({'address': rest.address}, (results, status) => {
        if(status == google.maps.GeocoderStatus.OK) {
            const coords = results[0].geometry.location;
            const n = next({...rest, coords, type: SUCCESS});
            _resolve(coords.toJSON());
            return n;
        } else {
          _reject(status);
          return next({...rest, error: status, type: FAILURE});
        }
      })
    } else {
      return next({...rest, error: 'Geocoder not initialized', type: FAILURE})
    }
  }
}
