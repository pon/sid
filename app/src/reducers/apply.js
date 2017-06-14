import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const SUBMIT_APPLY_STEP_ONE = 'SUBMIT_APPLY_STEP_ONE';
const SUBMIT_APPLY_STEP_ONE_SUCCESS = 'SUBMIT_APPLY_STEP_ONE_SUCCESS';
const SUBMIT_APPLY_STEP_ONE_FAILURE = 'SUBMIT_APPLY_STEP_ONE_FAILURE';


// CREATORS
export const submitApplyStepOne = payload => ({
  type: SUBMIT_APPLY_STEP_ONE,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchApplyStepOne = payload => {
  return fetch('http://localhost:4000/apply/step-one', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_STEP_ONE_SUCCESS,
      payload: {}
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_STEP_ONE_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_APPLY_STEP_ONE:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyStepOne,
          payload
        )
      );
    case SUBMIT_APPLY_STEP_ONE_SUCCESS:
      state.set('isSubmitting', false);
      return
    case SUBMIT_APPLY_STEP_ONE_FAILURE:
      // Show the Error
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    default:
      return state;
  }
}