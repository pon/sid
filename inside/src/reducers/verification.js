import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_APPLICATIONS = 'GET_APPLICATIONS';
const GET_APPLICATIONS_SUCCESS = 'GET_APPLICATIONS_SUCCESS';
const GET_APPLICATIONS_FAILURE = 'GET_APPLICATIONS_FAILURE';
const GET_APPLICATION = 'GET_APPLICATION';
const GET_APPLICATION_SUCCESS = 'GET_APPLICATION_SUCCESS';
const GET_APPLICATION_FAILURE = 'GET_APPLICATION_FAILURE';
const SUBMIT_VERIFY_INCOME = 'SUBMIT_VERIFY_INCOME';
const SUBMIT_VERIFY_INCOME_SUCCESS = 'SUBMIT_VERIFY_INCOME_SUCCESS';
const SUBMIT_VERIFY_INCOME_FAILURE = 'SUBMIT_VERIFY_INCOME_FAILURE';
const SUBMIT_UNVERIFY_INCOME = 'SUBMIT_UNVERIFY_INCOME';
const SUBMIT_UNVERIFY_INCOME_SUCCESS = 'SUBMIT_UNVERIFY_INCOME_SUCCESS';
const SUBMIT_UNVERIFY_INCOME_FAILURE = 'SUBMIT_UNVERIFY_INCOME_FAILURE';

// CREATORS
export const getApplicationsInVerification = payload => ({
  type: GET_APPLICATIONS,
  payload
});

export const getApplicationForVerification = applicationId => ({
  type: GET_APPLICATION,
  payload: {applicationId}
})

export const verifyIncome = income => ({
  type: SUBMIT_VERIFY_INCOME,
  payload: income
})

export const unverifyIncome = incomeId => ({
  type: SUBMIT_UNVERIFY_INCOME,
  payload: incomeId
})

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null,
  applications: null,
  application: null
});

// FETCHERS
const getApplicationsInVerificationFetcher = payload => {
  return fetch(`${API_ROOT}/verification/applications`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: GET_APPLICATIONS_SUCCESS,
      payload: {
        applications: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_APPLICATIONS_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

const getApplicationForVerificationFetcher = payload => {
  return fetch(`${API_ROOT}/verification/applications/${payload.applicationId}`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: GET_APPLICATION_SUCCESS,
      payload: {
        application: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_APPLICATION_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
};

const verifyIncomeFetcher = income => {
  return fetch(`${API_ROOT}/verification/incomes/${income.id}/verify`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: JSON.stringify({verified_income: income.verified_income})
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_VERIFY_INCOME_SUCCESS,
      payload: {
        income: response
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_VERIFY_INCOME_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
};

const unverifyIncomeFetcher = incomeId => {
  return fetch(`${API_ROOT}/verification/incomes/${incomeId}/unverify`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_UNVERIFY_INCOME_SUCCESS,
      payload: {
        income: response
      }
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_UNVERIFY_INCOME_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_APPLICATIONS:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(getApplicationsInVerificationFetcher)
      );
    case GET_APPLICATIONS_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('applications', payload.applications);
    case GET_APPLICATIONS_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case GET_APPLICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          getApplicationForVerificationFetcher,
          payload
        ),
      );
    case GET_APPLICATION_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('application', payload.application);
    case GET_APPLICATION_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_VERIFY_INCOME:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          verifyIncomeFetcher,
          payload
        )
      );
    case SUBMIT_VERIFY_INCOME_SUCCESS:
      const verifiedIncomeApplication = state.get('application');
      verifiedIncomeApplication.incomes = verifiedIncomeApplication.incomes.map(income => {
        if (income.id === payload.income.id) {
          return payload.income;
        }
        return income;
      });
      return state 
        .set('application', verifiedIncomeApplication)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Income Successfully Verified!');
    case SUBMIT_VERIFY_INCOME_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_UNVERIFY_INCOME:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          unverifyIncomeFetcher,
          payload
        )
      );
    case SUBMIT_UNVERIFY_INCOME_SUCCESS:
      const unverifiedIncomeApplication = state.get('application');
      unverifiedIncomeApplication.incomes = unverifiedIncomeApplication.incomes.map(income => {
        if (income.id === payload.income.id) {
          return payload.income;
        }

        return income;
      })
      return state 
        .set('isSubmitting', false)
        .set('application', unverifiedIncomeApplication)
        .delete('error')
        .set('successMessage', 'Income Successfully Unverified!');
    case SUBMIT_UNVERIFY_INCOME_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}