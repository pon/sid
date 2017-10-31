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
const SUBMIT_VERIFY_IDENTITY = 'SUBMIT_VERIFY_IDENTITY';
const SUBMIT_VERIFY_IDENTITY_SUCCESS = 'SUBMIT_VERIFY_IDENTITY_SUCCESS';
const SUBMIT_VERIFY_IDENTITY_FAILURE = 'SUBMIT_VERIFY_IDENTITY_FAILURE';
const SUBMIT_UNVERIFY_IDENTITY = 'SUBMIT_UNVERIFY_IDENTITY';
const SUBMIT_UNVERIFY_IDENTITY_SUCCESS = 'SUBMIT_UNVERIFY_IDENTITY_SUCCESS';
const SUBMIT_UNVERIFY_IDENTITY_FAILURE = 'SUBMIT_UNVERIFY_IDENTITY_FAILURE';
const SUBMIT_VERIFY_CITIZENSHIP = 'SUBMIT_VERIFY_CITIZENSHIP';
const SUBMIT_VERIFY_CITIZENSHIP_SUCCESS = 'SUBMIT_VERIFY_CITIZENSHIP_SUCCESS';
const SUBMIT_VERIFY_CITIZENSHIP_FAILURE = 'SUBMIT_VERIFY_CITIZENSHIP_FAILURE';
const SUBMIT_UNVERIFY_CITIZENSHIP = 'SUBMIT_UNVERIFY_CITIZENSHIP';
const SUBMIT_UNVERIFY_CITIZENSHIP_SUCCESS = 'SUBMIT_UNVERIFY_CITIZENSHIP_SUCCESS';
const SUBMIT_UNVERIFY_CITIZENSHIP_FAILURE = 'SUBMIT_UNVERIFY_CITIZENSHIP_FAILURE';
const SUBMIT_VERIFY_APPLICATION = 'SUBMIT_VERIFY_APPLICATION';
const SUBMIT_VERIFY_APPLICATION_SUCCESS = 'SUBMIT_VERIFY_APPLICATION_SUCCESS';
const SUBMIT_VERIFY_APPLICATION_FAILURE = 'SUBMIT_VERIFY_APPLICATION_FAILURE';
const SUBMIT_REVERIFY_APPLICATION = 'SUBMIT_REVERIFY_APPLICATION';
const SUBMIT_REVERIFY_APPLICATION_SUCCESS = 'SUBMIT_REVERIFY_APPLICATION_SUCCESS';
const SUBMIT_REVERIFY_APPLICATION_FAILURE = 'SUBMIT_REVERIFY_APPLICATION_FAILURE';
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
});

export const verifyIncome = income => ({
  type: SUBMIT_VERIFY_INCOME,
  payload: income
});

export const unverifyIncome = incomeId => ({
  type: SUBMIT_UNVERIFY_INCOME,
  payload: incomeId
});

export const verifyApplication = applicationId => ({
  type: SUBMIT_VERIFY_APPLICATION,
  payload: applicationId
});

export const reverifyApplication = applicationId => ({
  type: SUBMIT_REVERIFY_APPLICATION,
  payload: applicationId
});

export const verifyIdentity = userId => ({
  type: SUBMIT_VERIFY_IDENTITY,
  payload: userId
});

export const unverifyIdentity = userId => ({
  type: SUBMIT_UNVERIFY_IDENTITY,
  payload: userId
});

export const verifyCitizenship = userId => ({
  type: SUBMIT_VERIFY_CITIZENSHIP,
  payload: userId
});

export const unverifyCitizenship = userId => ({
  type: SUBMIT_UNVERIFY_CITIZENSHIP,
  payload: userId
});

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

const verifyApplicationFetcher = applicationId => {
  return fetch(`${API_ROOT}/verification/applications/${applicationId}/complete-verification`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_VERIFY_APPLICATION_SUCCESS,
      payload: {
        application: response
      }
    };
  })
  .catch(err => {
    return {
      type: SUBMIT_VERIFY_APPLICATION_FAILURE,
      payload: {
        error: err.message
      }
    };
  })
};

const reverifyApplicationFetcher = applicationId => {
  return fetch(`${API_ROOT}/verification/applications/${applicationId}/re-verify`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_REVERIFY_APPLICATION_SUCCESS,
      payload: {
        application: response
      }
    };
  })
  .catch(err => {
    return {
      type: SUBMIT_REVERIFY_APPLICATION_FAILURE,
      payload: {
        error: err.message
      }
    };
  })
};

const verifyIdentityFetcher = userId => {
  return fetch(`${API_ROOT}/verification/users/${userId}/verify-identity`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_VERIFY_IDENTITY_SUCCESS,
      payload: {
        profile: response
      }
    };
  })
  .catch(err => {
    return {
      type: SUBMIT_VERIFY_IDENTITY_FAILURE,
      payload: {
        error: err.message
      }
    };
  })
};

const unverifyIdentityFetcher = userId => {
  return fetch(`${API_ROOT}/verification/users/${userId}/unverify-identity`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_UNVERIFY_IDENTITY_SUCCESS,
      payload: {
        profile: response
      }
    };
  })
  .catch(err => {
    return {
      type: SUBMIT_UNVERIFY_IDENTITY_FAILURE,
      payload: {
        error: err.message
      }
    };
  })
};

const verifyCitizenshipFetcher = userId => {
  return fetch(`${API_ROOT}/verification/users/${userId}/verify-citizenship`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_VERIFY_CITIZENSHIP_SUCCESS,
      payload: {
        profile: response
      }
    };
  })
  .catch(err => {
    return {
      type: SUBMIT_VERIFY_CITIZENSHIP_FAILURE,
      payload: {
        error: err.message
      }
    };
  })
};

const unverifyCitizenshipFetcher = userId => {
  return fetch(`${API_ROOT}/verification/users/${userId}/unverify-citizenship`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_UNVERIFY_CITIZENSHIP_SUCCESS,
      payload: {
        profile: response
      }
    };
  })
  .catch(err => {
    return {
      type: SUBMIT_UNVERIFY_CITIZENSHIP_FAILURE,
      payload: {
        error: err.message
      }
    };
  })
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
    case SUBMIT_VERIFY_APPLICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          verifyApplicationFetcher,
          payload
        )
      );
    case SUBMIT_VERIFY_APPLICATION_SUCCESS:
      const verifiedApplication = state.get('application');
      verifiedApplication.status = payload.application.status;
      return state
        .set('application', verifiedApplication)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Application Verified!');
    case SUBMIT_VERIFY_APPLICATION_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_REVERIFY_APPLICATION:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          reverifyApplicationFetcher,
          payload
        )
      );
    case SUBMIT_REVERIFY_APPLICATION_SUCCESS:
      const reverifiedApplication = state.get('application');
      reverifiedApplication.status = payload.application.status;
      return state
        .set('application', reverifiedApplication)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Application Unverified!');
    case SUBMIT_REVERIFY_APPLICATION_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_VERIFY_IDENTITY:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          verifyIdentityFetcher,
          payload
        )
      );
    case SUBMIT_VERIFY_IDENTITY_SUCCESS:
      const verifiedIdentityApp = state.get('application');
      verifiedIdentityApp.profile = payload.profile;
      return state
        .set('application', verifiedIdentityApp)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Identity Verified!');
    case SUBMIT_VERIFY_IDENTITY_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_UNVERIFY_IDENTITY:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          unverifyIdentityFetcher,
          payload
        )
      );
    case SUBMIT_UNVERIFY_IDENTITY_SUCCESS:
      const unverifiedIdentityApplication = state.get('application');
      unverifiedIdentityApplication.profile = payload.profile;
      return state
        .set('application', unverifiedIdentityApplication)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Identity Unverified!');
    case SUBMIT_UNVERIFY_IDENTITY_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_VERIFY_CITIZENSHIP:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          verifyCitizenshipFetcher,
          payload
        )
      );
    case SUBMIT_VERIFY_CITIZENSHIP_SUCCESS:
      const verifiedCitizenshipApp = state.get('application');
      verifiedCitizenshipApp.profile = payload.profile;
      return state
        .set('application', verifiedCitizenshipApp)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Citizenship Verified!');
    case SUBMIT_VERIFY_CITIZENSHIP_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_UNVERIFY_CITIZENSHIP:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          unverifyCitizenshipFetcher,
          payload
        )
      );
    case SUBMIT_UNVERIFY_CITIZENSHIP_SUCCESS:
      const unverifiedCitizenshipApplication = state.get('application');
      unverifiedCitizenshipApplication.profile = payload.profile;
      return state
        .set('application', unverifiedCitizenshipApplication)
        .set('isSubmitting', false)
        .delete('error')
        .set('successMessage', 'Citizenship Unverified!');
    case SUBMIT_UNVERIFY_CITIZENSHIP_FAILURE:
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
