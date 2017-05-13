import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const SUBMIT_FORGOT_PASSWORD = 'SUBMIT_FORGOT_PASSWORD';
const SUBMIT_FORGOT_PASSWORD_SUCCESS = 'SUBMIT_FORGOT_PASSWORD_SUCCESS';
const SUBMIT_FORGOT_PASSWORD_FAILURE = 'SUBMIT_FORGOT_PASSWORD_FAILURE';

// CREATORS
export const submitForgotPassword = payload => ({
  type: SUBMIT_FORGOT_PASSWORD,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  successMessage: null,
  error: null
});

// FETCHERS
const submitForgotPasswordFetcher = payload => {
  return fetch('http://localhost:4000/password-reset', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_FORGOT_PASSWORD_SUCCESS
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_FORGOT_PASSWORD_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_FORGOT_PASSWORD:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitForgotPasswordFetcher,
          payload
        )
      );
    case SUBMIT_FORGOT_PASSWORD_SUCCESS:
      state.set('isSubmitting', false);
      return state.set('successMessage', 'Check your email for reset instructions.');
    case SUBMIT_FORGOT_PASSWORD_FAILURE:
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    default:
      return state;
  }
}