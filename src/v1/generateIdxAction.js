import fetch from 'cross-fetch';
import { divideActionParamsByMutability } from './actionParser';
import { userAgentHeaders } from '../userAgent';
import makeIdxState from './makeIdxState';

const generateDirectFetch = function generateDirectFetch( { actionDefinition, defaultParamsForAction = {}, immutableParamsForAction = {}, toPersist } ) {
  const target = actionDefinition.href;
  return async function(params) {
    return fetch(target, {
      method: actionDefinition.method,
      headers: {
        ...userAgentHeaders(),
        'content-type': 'application/json',
        'accept': actionDefinition.accepts || 'application/ion+json',
      },
      body: JSON.stringify({ ...defaultParamsForAction, ...params, ...immutableParamsForAction })
    })
      .then( response => {
        const respJson = response.json();
        if (response.ok) {
          return respJson;
        } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'Oktadevicejwt realm="Okta Device"') {
          // Okta server responds 401 status code with WWW-Authenticate header and new remediation
          // so that the iOS/MacOS credential SSO extension (Okta Verify) can intercept
          // the response reaches here when Okta Verify is not installed
          // we need to return an idx object so that
          // the SIW can proceed to the next step without showing error
          return respJson.then(err => Promise.reject(makeIdxState(err, toPersist)) );
        }
        return respJson.then(err => {
          if (err.version) { // assumed idx response
            return err; // idx response as HTTP errors are not treated as errors
          }
          return Promise.reject(err);
        });
      })
      .then( idxResponse => makeIdxState(idxResponse, toPersist) );
  };
};

// TODO: Resolve in M2: Either build the final polling solution or remove this code
// const generatePollingFetch = function generatePollingFetch( { actionDefinition, defaultParamsForAction = {}, immutableParamsForAction = {} } ) {
//   // TODO: Discussions ongoing about when/how to terminate polling: OKTA-246581
//   const target = actionDefinition.href;
//   return async function(params) {
//     return fetch(target, {
//       method: actionDefinition.method,
//       headers: {
//         'content-type': actionDefinition.accepts,
//       },
//       body: JSON.stringify({ ...defaultParamsForAction, ...params, ...immutableParamsForAction })
//     })
//       .then( response => response.ok ? response.json() : response.json().then( err => Promise.reject(err)) )
//       .then( idxResponse => makeIdxState(idxResponse) );
//   };
// };

const generateIdxAction = function generateIdxAction( actionDefinition, toPersist ) {
  // TODO: leaving this here to see where the polling is EXPECTED to drop into the code, but removing any accidental trigger of incomplete code
  // const generator =  actionDefinition.refresh ? generatePollingFetch : generateDirectFetch;
  const generator = generateDirectFetch;
  const { defaultParams, neededParams, immutableParams } = divideActionParamsByMutability( actionDefinition );

  const action = generator( {
    actionDefinition,
    defaultParamsForAction: defaultParams[actionDefinition.name],
    immutableParamsForAction: immutableParams[actionDefinition.name],
    toPersist
  });
  action.neededParams = neededParams;
  return action;
};

export default generateIdxAction;
