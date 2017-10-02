import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const FETCH_PROFILE = 'FETCH_PROFILE';
const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';

// CREATORS
export const fetchProfile = payload => ({
  type: FETCH_PROFILE,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isFetching: false,
  error: null,
  user: null
});

// FETCHERS
const fetchProfileFetcher = () => {
  return fetch(`${API_ROOT}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: FETCH_PROFILE_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: FETCH_PROFILE_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_PROFILE:
      return loop(
        state.set('isFetching', true),
        Effects.promise(fetchProfileFetcher)
      )
    case FETCH_PROFILE_SUCCESS:
      state.set('isFetching', false);
      return state.set('user', payload);
    case FETCH_PROFILE_FAILURE:
      state.set('isFetching', false);
      return state.set('error', payload.error);
    default:
      return state;
  }
}
