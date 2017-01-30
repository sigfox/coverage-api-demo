export default function apiClientMiddleware(client) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { apiPromise, types, resolve, reject, ...rest } = action; // eslint-disable-line no-redeclare
    if (!apiPromise) {
      return next(action);
    }

    const _resolve = resolve || (() => {});
    const _reject = reject || (() => {});

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });
    return apiPromise(client)
      .then(
        (result) => {
          _resolve(result);
          return next({ ...rest, result, type: SUCCESS });
        },
        (error) => {
          _reject(error);
          return next({ ...rest, error, type: FAILURE });
        }
      ).catch((error) => {
        console.error('API MIDDLEWARE ERROR:', error.stack);
        _reject(error);
        return next({ ...rest, error, type: FAILURE });
      });
  };
}
