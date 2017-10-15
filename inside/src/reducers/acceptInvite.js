import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';
import {push} from 'react-router-redux';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const SUBMIT_ACCEPT_INVITATION           = 'SUBMIT_ACCEPT_INVITATION';
const SUBMIT_ACCEPT_INVITATION_SUCCESS   = 'SUBMIT_ACCEPT_INVITATION_SUCCESS';
const SUBMIT_ACCEPT_INVITATION_FAILURE   = 'SUBMIT_ACCEPT_INVITATION_FAILURE';
const SUBMIT_CHECK_INVITE_STATUS         = 'SUBMIT_CHECK_INVITE_STATUS';
const SUBMIT_CHECK_INVITE_STATUS_SUCCESS = 'SUBMIT_CHECK_INVITE_STATUS_SUCCESS';
const SUBMIT_CHECK_INVITE_STATUS_FAILURE = 'SUBMIT_CHECK_INVITE_STATUS_FAILURE';

// CREATORS
export const submitAcceptInvitation = payload => ({
  type: SUBMIT_ACCEPT_INVITATION,
  payload
});

export const submitCheckInviteStatus = payload => ({
  type: SUBMIT_CHECK_INVITE_STATUS,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  successMessage: null,
  inviteStatus: null,
  error: null
});

// FETCHERS
const submitAcceptInvitationFetcher = payload => {
  return fetch(`${API_ROOT}/accept-invite`, {
    method: 'POST',
    body: JSON.stringify({
      token: payload.token,
      password: payload.password
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_ACCEPT_INVITATION_SUCCESS,
      payload: {
        token: response.token
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_ACCEPT_INVITATION_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

const submitCheckInviteStatusFetcher = payload => {
  return fetch(`${API_ROOT}/invite-status?token=${payload.token}`)
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_CHECK_INVITE_STATUS_SUCCESS,
      payload: {
        status: response.status
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_CHECK_INVITE_STATUS_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_ACCEPT_INVITATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitAcceptInvitationFetcher,
          payload
        )
      );
    case SUBMIT_ACCEPT_INVITATION_SUCCESS:
      sessionStorage.setItem('jwtToken', payload.token);
      return loop( 
        state
          .set('isSubmitting', false)
          .delete('error')
          .set('successMessage', 'Welcome to Poplar Inside!'),
        Effects.constant(push('/dashboard'))
      );
    case SUBMIT_ACCEPT_INVITATION_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_CHECK_INVITE_STATUS:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitCheckInviteStatusFetcher,
          payload
        )
      );
    case SUBMIT_CHECK_INVITE_STATUS_SUCCESS:
      return state
        .set('isSubmitting', false)
        .delete('error')
        .set('inviteStatus', payload.status);
    case SUBMIT_CHECK_INVITE_STATUS_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}