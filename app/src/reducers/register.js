import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const SUBMIT_REGISTER = 'SUBMIT_REGISTER';
const SUBMIT_REGISTER_SUCCESS = 'SUBMIT_REGISTER_SUCCESS';
const SUBMIT_REGISTER_FAILURE = 'SUBMIT_REGISTER_FAILURE';

// CREATORS
export const submitRegister = payload => ({
  type: SUBMIT_REGISTER,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchRegister = payload => {
  return fetch(`${API_ROOT}/register`, {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      password: payload.password
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_REGISTER_SUCCESS,
      payload: {
        token: response.token
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_REGISTER_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_REGISTER:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchRegister,
          payload
        )
      );
    case SUBMIT_REGISTER_SUCCESS:
      state.set('isSubmitting', false);
      return sessionStorage.setItem('jwtToken', payload.token);
    case SUBMIT_REGISTER_FAILURE:
      // Show the Error
      state.set('isSubmitting', false);
      return state.set('error', payload.error);
    default:
      return state;
  }
}
