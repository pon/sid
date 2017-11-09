import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_UNDERWRITING_APPLICATIONS         = 'GET_UNDERWRITING_APPLICATIONS';
const GET_UNDERWRITING_APPLICATIONS_SUCCESS = 'GET_UNDERWRITING_APPLICATIONS_SUCCESS';
const GET_UNDERWRITING_APPLICATIONS_FAILURE = 'GET_UNDERWRITING_APPLICATIONS_FAILURE';

// CREATORS
export const getApplicationsInUnderwriting = payload => ({
  type: GET_UNDERWRITING_APPLICATIONS,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null,
  applications: null,
  application: null
});

// FETCHERS
const getApplicationsInUnderwritingFetcher = payload => {
  return fetch(`${API_ROOT}/underwriting/applications`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: GET_UNDERWRITING_APPLICATIONS_SUCCESS,
      payload: {
        applications: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_UNDERWRITING_APPLICATIONS_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_UNDERWRITING_APPLICATIONS:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(getApplicationsInUnderwritingFetcher)
      );
    case GET_UNDERWRITING_APPLICATIONS_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('applications', payload.applications);
    case GET_UNDERWRITING_APPLICATIONS_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}
