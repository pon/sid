import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const SUBMIT_EMAIL_VERIFICATION = 'SUBMIT_EMAIL_VERIFICATION';
const SUBMIT_EMAIL_VERIFICATION_SUCCESS = 'SUBMIT_EMAIL_VERIFICATION_SUCCESS';
const SUBMIT_EMAIL_VERIFICATION_FAILURE = 'SUBMIT_EMAIL_VERIFICATION_FAILURE';
const SUBMIT_RESEND_EMAIL_VERIFICATION = 'SUBMIT_RESEND_EMAIL_VERIFICATION';
const SUBMIT_RESEND_EMAIL_VERIFICATION_SUCCESS = 'SUBMIT_RESEND_EMAIL_VERIFICATION_SUCCESS';
const SUBMIT_RESEND_EMAIL_VERIFICATION_FAILURE = 'SUBMIT_RESEND_EMAIL_VERIFICATION_FAILURE';

// CREATORS
export const submitEmailVerification = payload => ({
  type: SUBMIT_EMAIL_VERIFICATION,
  payload
});

export const submitResendEmailVerification = payload => ({
  type: SUBMIT_RESEND_EMAIL_VERIFICATION,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  successMessage: null,
  error: null
});

// FETCHERS
const submitEmailVerificationFetcher = payload => {
  return fetch(`${API_ROOT}/verify-email`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: JSON.stringify({
      token: payload.token,
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_EMAIL_VERIFICATION_SUCCESS
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_EMAIL_VERIFICATION_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

const submitResendEmailVerificationFetcher = payload => {
  return fetch(`${API_ROOT}/resend-email-verification`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_RESEND_EMAIL_VERIFICATION_SUCCESS
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_RESEND_EMAIL_VERIFICATION_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_EMAIL_VERIFICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitEmailVerificationFetcher,
          payload
        )
      );
    case SUBMIT_EMAIL_VERIFICATION_SUCCESS:
      return state
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Your email has been verified!');
    case SUBMIT_EMAIL_VERIFICATION_FAILURE:
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    case SUBMIT_RESEND_EMAIL_VERIFICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitResendEmailVerificationFetcher,
          payload
        )
      );
    case SUBMIT_RESEND_EMAIL_VERIFICATION_SUCCESS:
      return state
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Check your email for the new verification code!');
    case SUBMIT_RESEND_EMAIL_VERIFICATION_FAILURE:
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    default:
      return state;
  }
}