import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_UNDERWRITING_APPLICATIONS         = 'GET_UNDERWRITING_APPLICATIONS';
const GET_UNDERWRITING_APPLICATIONS_SUCCESS = 'GET_UNDERWRITING_APPLICATIONS_SUCCESS';
const GET_UNDERWRITING_APPLICATIONS_FAILURE = 'GET_UNDERWRITING_APPLICATIONS_FAILURE';
const GET_UNDERWRITING_APPLICATION          = 'GET_UNDERWRITING_APPLICATION';
const GET_UNDERWRITING_APPLICATION_SUCCESS  = 'GET_UNDERWRITING_APPLICATION_SUCCESS';
const GET_UNDERWRITING_APPLICATION_FAILURE  = 'GET_UNDERWRITING_APPLICATION_FAILURE';
const SUBMIT_APPROVE_APPLICATION            = 'SUBMIT_APPROVE_APPLICATION';
const SUBMIT_APPROVE_APPLICATION_SUCCESS    = 'SUBMIT_APPROVE_APPLICATION_SUCCESS';
const SUBMIT_APPROVE_APPLICATION_FAILURE    = 'SUBMIT_APPROVE_APPLICATION_FAILURE';

// CREATORS
export const getApplicationsInUnderwriting = payload => ({
  type: GET_UNDERWRITING_APPLICATIONS,
  payload
});

export const getApplicationInUnderwriting = payload => ({
  type: GET_UNDERWRITING_APPLICATION,
  payload
})

export const submitApproveApplication = payload => ({
  type: SUBMIT_APPROVE_APPLICATION,
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
};

const getApplicationInUnderwritingFetcher = payload => {
  return fetch(`${API_ROOT}/underwriting/applications/${payload}`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: GET_UNDERWRITING_APPLICATION_SUCCESS,
      payload: {
        application: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_UNDERWRITING_APPLICATION_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
};

const submitApproveApplicationFetcher = payload => {
  return fetch(`${API_ROOT}/underwriting/applications/${payload.applicationId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: JSON.stringify({
      interest_rate: payload.interestRate,
      amount: payload.amount,
      term_months: payload.termMonths
    })
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPROVE_APPLICATION_SUCCESS,
      payload: {
        application: response
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPROVE_APPLICATION_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
};


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
   case GET_UNDERWRITING_APPLICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(getApplicationInUnderwritingFetcher, payload)
      );
    case GET_UNDERWRITING_APPLICATION_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('application', payload.application);
    case GET_UNDERWRITING_APPLICATION_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
   case SUBMIT_APPROVE_APPLICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(submitApproveApplicationFetcher, payload)
      );
    case SUBMIT_APPROVE_APPLICATION_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('successMessage', 'Application Approved!')
        .set('application', payload.application);
    case SUBMIT_APPROVE_APPLICATION_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}
