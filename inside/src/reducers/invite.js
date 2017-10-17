import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_INVITED_USERS = 'GET_INVITED_USERS';
const GET_INVITED_USERS_SUCCESS = 'GET_INVITED_USERS_SUCCESS';
const GET_INVITED_USERS_FAILURE = 'GET_INVITED_USERS_FAILURE';
const SEND_INVITE = 'SEND_INVITE';
const SEND_INVITE_SUCCESS = 'SEND_INVITE_SUCCESS';
const SEND_INVITE_FAILURE = 'SEND_INVITE_FAILURE';

// CREATORS
export const getInvitedUsers = payload => ({
  type: GET_INVITED_USERS,
  payload
});

export const sendInvite = payload => ({
  type: SEND_INVITE,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null,
  successMessage: null,
  users: []
});

// FETCHERS
const getInvitedUsersFetcher = payload => {
  return fetch(`${API_ROOT}/invited-users`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: GET_INVITED_USERS_SUCCESS,
      payload: {
        users: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_INVITED_USERS_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

const sendInviteFetcher = payload => {
  return fetch(`${API_ROOT}/invite`, {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SEND_INVITE_SUCCESS
    }
  })
  .catch(error => {
    return {
      type: SEND_INVITE_FAILURE,
      payload: {
        error: error.message
      }
    }
  });
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_INVITED_USERS:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(getInvitedUsersFetcher)
      );
    case GET_INVITED_USERS_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('users', payload.users);
    case GET_INVITED_USERS_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SEND_INVITE:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          sendInviteFetcher,
          payload
        )
      );
    case SEND_INVITE_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('successMessage', 'Invite Sent!')
        .delete('error');
    case SEND_INVITE_FAILURE:
      return state.set('error', payload.error);
    default:
      return state;
  }
}