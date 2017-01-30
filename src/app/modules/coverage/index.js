import _ from 'lodash';
import async from 'async';

export const GEOCODE_REQUEST = 'GEOCODE_REQUEST';
export const GEOCODE_REQUEST_SUCCESS = 'GEOCODE_REQUEST_SUCCESS';
export const GEOCODE_REQUEST_ERROR = 'GEOCODE_REQUEST_ERROR';

export const GEOCODE_BATCH_START = 'GEOCODE_BATCH_START';
export const GEOCODE_BATCH_END = 'GEOCODE_BATCH_END';
export const GEOCODE_BATCH_REQUEST = 'GEOCODE_BATCH_REQUEST';
export const GEOCODE_BATCH_REQUEST_SUCCESS = 'GEOCODE_BATCH_REQUEST_SUCCESS';
export const GEOCODE_BATCH_REQUEST_ERROR = 'GEOCODE_BATCH_REQUEST_ERROR';

export const COVERAGE_REQUEST = 'COVERAGE_REQUEST';
export const COVERAGE_REQUEST_SUCCESS = 'COVERAGE_REQUEST_SUCCESS';
export const COVERAGE_REQUEST_ERROR = 'COVERAGE_REQUEST_ERROR';

export const COVERAGE_BATCH_REQUEST = 'COVERAGE_BATCH_REQUEST';
export const COVERAGE_BATCH_REQUEST_SUCCESS = 'COVERAGE_BATCH_REQUEST_SUCCESS';
export const COVERAGE_BATCH_REQUEST_ERROR = 'COVERAGE_BATCH_REQUEST_ERROR';

export const PARSED_LIST_RESULT = 'PARSED_LIST_RESULT';
export const CLEAR_PARSED_LIST = 'CLEAR_PARSED_LIST';

export const initialState = {
  singleCoverage: {
    geocoding: false,
    geocodeError: false,
    address: '',
    coords: null,
    coverage: null
  },
  batchCoverage: {
    addresses: [],
    geocoding: false,
    geocodeError: false,
    finished: false,
    testing: false
  }
}

export function geocode(address, resolve, reject) {
  return {
    type: 'geocode',
    types: [GEOCODE_REQUEST, GEOCODE_REQUEST_SUCCESS, GEOCODE_REQUEST_ERROR],
    address,
    resolve,
    reject
  }
}

export function checkCoverage(coords, resolve, reject) {
  return {
    type: 'api',
    types: [COVERAGE_REQUEST, COVERAGE_REQUEST_SUCCESS, COVERAGE_REQUEST_ERROR],
    apiPromise: (client) => client.get('/predictions', {params: coords}),
    resolve,
    reject
  }
}

export function parseAddresses(list, resolve, reject) {
  const addresses = list.map( a => _.values(a).join(' '));
  return {
    type: PARSED_LIST_RESULT,
    result: addresses
  }
}

export function clearAddresses(){
  return {
    type: CLEAR_PARSED_LIST
  }
}

export function processBatch(){
  return (dispatch, getState) => {
    const addresses =
    dispatch(geocodeBatch(getState().coverage.batchCoverage.addresses, () => dispatch(checkCoverageBatch(getState().coverage.batchCoverage.addresses))))
  }
}

export function geocodeBatch(addresses, resolve) {
  return (dispatch) => {
    dispatch({type: GEOCODE_BATCH_START});
    async.series(addresses.map(a => {
      const address = a.address;
      return (cb) => {
        setTimeout(() => {
          dispatch({
            type: 'geocode',
            types: [GEOCODE_BATCH_REQUEST, GEOCODE_BATCH_REQUEST_SUCCESS, GEOCODE_BATCH_REQUEST_ERROR],
            address,
            resolve: (result) => cb(null, result)
          })
        }, 20)
      }
    }), (err, results) => {
      resolve();
    })
  }
}

export function checkCoverageBatch(addresses, resolve) {
  const location = addresses.map(a => a.coords);
  return (dispatch) => dispatch({
    type: 'api',
    types: [COVERAGE_BATCH_REQUEST, COVERAGE_BATCH_REQUEST_SUCCESS, COVERAGE_BATCH_REQUEST_ERROR],
    apiPromise: (client) => client.post('/predictions', {data: {location}}),
    resolve: () => dispatch({type: GEOCODE_BATCH_END})
  })
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case GEOCODE_REQUEST:
      const singleGeocodeRequest = Object.assign({}, initialState.singleCoverage, {address: action.address, geocoding: true});
      return Object.assign({}, state, {singleCoverage: singleGeocodeRequest} )
    case GEOCODE_REQUEST_SUCCESS:
      const singleGeocodeSuccess = Object.assign({}, state.singleCoverage, {coords: action.coords, geocoding: false});
      return Object.assign({}, state, {singleCoverage: singleGeocodeSuccess});

    case GEOCODE_BATCH_REQUEST_SUCCESS:
      const batchGeocodeSuccess = Object.assign({}, state.batchCoverage);
      const address = _.find(batchGeocodeSuccess.addresses, {address: action.address})
      address.coords = action.coords.toJSON();
      return Object.assign({}, state, {batchCoverage: batchGeocodeSuccess});

    case COVERAGE_REQUEST_SUCCESS:
      const singleCoverageSuccess = Object.assign({}, state.singleCoverage, {coverage: action.result});
      return Object.assign({}, state, {singleCoverage: singleCoverageSuccess});

    case COVERAGE_BATCH_REQUEST_SUCCESS:
      const batchCoverageSuccess = Object.assign({}, state.batchCoverage);
      console.log(action.result)
      action.result.data.forEach((r, i) => {
        batchCoverageSuccess.addresses[i].coverage = r.margins;
      })
      return Object.assign({}, state, {batchCoverage: batchCoverageSuccess});

    case GEOCODE_BATCH_START:
      const geocodeBatchStart = Object.assign({}, state.batchCoverage);
      geocodeBatchStart.geocoding = true;
      return Object.assign({}, state, {batchCoverage: geocodeBatchStart})
    case GEOCODE_BATCH_END:
      const geocodeBatchEnd = Object.assign({}, state.batchCoverage);
      geocodeBatchEnd.geocoding = false;
      geocodeBatchEnd.finished = true;
      return Object.assign({}, state, {batchCoverage: geocodeBatchEnd})

    case PARSED_LIST_RESULT:
      const batchParseResult = Object.assign({}, state.batchCoverage, {addresses: action.result.map(a => ({
        address: a,
        coords: null,
        coverage: null
      }))})
      return Object.assign({}, state, {batchCoverage: batchParseResult});

    case CLEAR_PARSED_LIST:
      return Object.assign({}, state, {batchCoverage: initialState.batchCoverage});
    default: return state;
  }
}

export function getRoutes({ dispatch, getState }){
  return {
    path: '/',
    component: require('./pages/CoveragePage'),
    childRoutes: [
      {
        path: 'single',
        component: require('./pages/SinglePage')
      },
      {
        path: 'batch',
        component: require('./pages/BatchPage')
      }
    ],
    indexRoute: { onEnter: (nextState, replace) => replace('/single') },
  }
}
