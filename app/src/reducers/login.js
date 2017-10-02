import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';
import {push} from 'react-router-redux';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const SUBMIT_LOGIN = 'SUBMIT_LOGIN';
const SUBMIT_LOGIN_SUCCESS = 'SUBMIT_LOGIN_SUCCESS';
const SUBMIT_LOGIN_FAILURE = 'SUBMIT_LOGIN_FAILURE';
const SUBMIT_LOGOUT = 'SUBMIT_LOGOUT';

// CREATORS
export const submitLogin = payload => ({
  type: SUBMIT_LOGIN,
  payload
});

export const submitLoginSuccess = payload => ({
  type: SUBMIT_LOGIN_SUCCESS,
  payload
})

export const submitLogout = () => ({
  type: SUBMIT_LOGOUT
})

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null,
  isAuthenticated: !!sessionStorage.getItem('jwtToken')
});

// FETCHERS
const submitLoginFetcher = payload => {
  return fetch(`${API_ROOT}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      password: payload.password
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_LOGIN_SUCCESS,
      payload: {
        token: response.token,
        nextPath: payload.nextPath
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_LOGIN_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_LOGIN:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          submitLoginFetcher,
          payload
        )
      );
    case SUBMIT_LOGIN_SUCCESS:
      sessionStorage.setItem('jwtToken', payload.token);
      return loop(
        state
          .set('isAuthenticated', true)
          .set('isSubmitting', false),
        Effects.constant(push(payload.nextPath))
      )
    case SUBMIT_LOGIN_FAILURE:
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    case SUBMIT_LOGOUT:
      sessionStorage.removeItem('jwtToken');
      return loop(
        state.set('isAuthenticated', false),
        Effects.constant(push('/login'))
      );
    default:
      return state;
  }
}
