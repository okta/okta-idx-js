import { parseIdxResponse } from './idxResponseParser';

const makeIdxState = function makeIdxState( idxResponse, toPersist ) {
  const rawIdxResponse =  idxResponse;
  const { remediations, context, actions } = parseIdxResponse( idxResponse, toPersist );
  const neededToProceed = [...remediations];

  const proceed = async function( remediationChoice, paramsFromUser = {} ) {
    /*
    remediationChoice is the name attribute on each form
    name should remain unique for items inside the remediation that are considered forms(identify, select-factor)
    name can be duplicate for items like redirect where its not considered a form(redirect)
    when names are not unique its a redirect to a href, so widget wont POST to idx-js layer.
    */
    const remediationChoiceObject = remediations.find((remediation) => remediation.name === remediationChoice);
    if ( !remediationChoiceObject ) {
      return Promise.reject(`Unknown remediation choice: [${remediationChoice}]`);
    }

    return remediationChoiceObject.action(paramsFromUser);
  };

  const hasInteractionCode = function hasInteractionCode() {
    return !!rawIdxResponse.successWithInteractionCode;
  };

  const findCode = item => item.name === 'interaction_code';
  const interactionCode = rawIdxResponse.successWithInteractionCode?.value.find( findCode ).value;

  return {
    proceed,
    neededToProceed,
    actions,
    context,
    rawIdxState: rawIdxResponse,
    hasInteractionCode,
    interactionCode,
    toPersist,
  };
};

export default makeIdxState;
