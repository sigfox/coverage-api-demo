const getDataDependency = (component = {}, methodName) => { // eslint-disable-line arrow-body-style
  return component.WrappedComponent ?
    getDataDependency(component.WrappedComponent, methodName)
    : component[methodName];
};

export default (components, getState, dispatch, location, params, deferred) => {
  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData';

  return components
    // only look at ones with a static fetchData()
    .filter((component) => getDataDependency(component, methodName))
    // pull out fetch data methods
    .map((component) => getDataDependency(component, methodName))
    // call fetch data methods and save promises
    .map(fetchData => fetchData(getState, dispatch, location, params));
};
