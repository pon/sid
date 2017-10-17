import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_APPLICATION_STATS = 'GET_APPLICATION_STATS';
const GET_APPLICATION_STATS_SUCCESS = 'GET_APPLICATION_STATS_SUCCESS';
const GET_APPLICATION_STATS_FAILURE = 'GET_APPLICATION_STATS_FAILURE';

// CREATORS
export const getApplicationStats = payload => ({
  type: GET_APPLICATION_STATS,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null,
  applicationStats: null
});

// FETCHERS
const getApplicationStatsFetcher = payload => {
  return fetch(`${API_ROOT}/dashboard/application-statistics`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: GET_APPLICATION_STATS_SUCCESS,
      payload: {
        applicationStats: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_APPLICATION_STATS_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_APPLICATION_STATS:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(getApplicationStatsFetcher)
      );
    case GET_APPLICATION_STATS_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('applicationStats', payload.applicationStats);
    case GET_APPLICATION_STATS_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}