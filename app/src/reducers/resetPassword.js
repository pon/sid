import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const SUBMIT_RESET_PASSWORD = 'SUBMIT_RESET_PASSWORD';
const SUBMIT_RESET_PASSWORD_SUCCESS = 'SUBMIT_RESET_PASSWORD_SUCCESS';
const SUBMIT_RESET_PASSWORD_FAILURE = 'SUBMIT_RESET_PASSWORD_FAILURE';

// CREATORS
export const submitResetPassword = payload => ({
  type: SUBMIT_RESET_PASSWORD,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  successMessage: null,
  error: null
});

// FETCHERS
const submitResetPasswordFetcher = payload => {
  debugger;
  return fetch('http://localhost:4000/change-password', {
    method: 'POST',
    body: JSON.stringify({
      token: payload.token,
      new_password: payload.newPassword,
      new_password_confirmation: payload.newPasswordConfirmation
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_RESET_PASSWORD_SUCCESS
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_RESET_PASSWORD_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_RESET_PASSWORD:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitResetPasswordFetcher,
          payload
        )
      );
    case SUBMIT_RESET_PASSWORD_SUCCESS:
      state.set('isSubmitting', false);
      return state.set('successMessage', 'Your password has been reset!');
    case SUBMIT_RESET_PASSWORD_FAILURE:
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    default:
      return state;
  }
}
