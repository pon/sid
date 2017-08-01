import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';
import {push} from 'react-router-redux';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const GET_DASHBOARD = 'GET_DASHBOARD';
const GET_DASHBOARD_SUCCESS = 'GET_DASHBOARD_SUCCESS';
const GET_DASHBOARD_FAILURE = 'GET_DASHBOARD_FAILURE';

// CREATORS
export const getDashboard = () => ({
  type: GET_DASHBOARD
})

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchGetDashboard = () => {
  return fetch(`http://localhost:4000/dashboard`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => ({
    type: GET_DASHBOARD_SUCCESS,
    payload: response
  }))
  .catch(error => ({
    type: GET_DASHBOARD_FAILURE,
    payload: {
      error: error.message
    }
  }));
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_DASHBOARD:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(fetchGetDashboard)
      )
    case GET_DASHBOARD_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('applications', payload.applications)
        .set('profile', payload.profile)
        .delete('error');
    case GET_DASHBOARD_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}