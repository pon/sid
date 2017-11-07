import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';
import {push} from 'react-router-redux';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_APPLY = 'GET_APPLY';
const GET_APPLY_SUCCESS = 'GET_APPLY_SUCCESS';
const GET_APPLY_FAILURE = 'GET_APPLY_FAILURE';
const SUBMIT_APPLY_REGISTER_STEP = 'SUBMIT_APPLY_REGISTER_STEP';
const SUBMIT_APPLY_REGISTER_STEP_SUCCESS = 'SUBMIT_APPLY_REGISTER_STEP_SUCCESS';
const SUBMIT_APPLY_REGISTER_STEP_FAILURE = 'SUBMIT_APPLY_REGISTER_STEP_FAILURE';
const SUBMIT_APPLY_APPLICATION_STEP = 'SUBMIT_APPLY_APPLICATION_STEP';
const SUBMIT_APPLY_APPLICATION_STEP_SUCCESS = 'SUBMIT_APPLY_APPLICATION_STEP_SUCCESS';
const SUBMIT_APPLY_APPLICATION_STEP_FAILURE = 'SUBMIT_APPLY_APPLICATION_STEP_FAILURE';
const SUBMIT_APPLY_UPLOAD_STEP = 'SUBMIT_APPLY_UPLOAD_STEP';
const SUBMIT_APPLY_UPLOAD_STEP_SUCCESS = 'SUBMIT_APPLY_UPLOAD_STEP_SUCCESS';
const SUBMIT_APPLY_UPLOAD_STEP_FAILURE = 'SUBMIT_APPLY_UPLOAD_STEP_FAILURE';
const SUBMIT_APPLY_CONFIRM_STEP = 'SUBMIT_APPLY_CONFIRM_STEP';
const SUBMIT_APPLY_CONFIRM_STEP_SUCCESS = 'SUBMIT_APPLY_CONFIRM_STEP_SUCCESS';
const SUBMIT_APPLY_CONFIRM_STEP_FAILURE = 'SUBMIT_APPLY_CONFIRM_STEP_FAILURE';


// CREATORS
export const getApply = () => ({
  type: GET_APPLY
})

export const submitApplyRegisterStep = payload => ({
  type: SUBMIT_APPLY_REGISTER_STEP,
  payload
});

export const submitApplyApplicationStep = payload => ({
  type: SUBMIT_APPLY_APPLICATION_STEP,
  payload
});

export const submitApplyUploadStep = payload => ({
  type: SUBMIT_APPLY_UPLOAD_STEP,
  payload
});

export const submitApplyConfirmStep = payload => ({
  type: SUBMIT_APPLY_CONFIRM_STEP,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchGetApply = () => {
  return fetch(`${API_ROOT}/apply`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => ({
    type: GET_APPLY_SUCCESS,
    payload: response
  }))
  .catch(error => ({
    type: GET_APPLY_FAILURE,
    payload: {
      error: error.message
    }
  }));
};

const fetchApplyRegisterStep = payload => {
  return fetch(`${API_ROOT}/apply/register`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_REGISTER_STEP_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_REGISTER_STEP_FAILURE,
      payload: {
        error: error.message,
        submittedValues: payload
      }
    };
  })
};

const fetchApplyApplicationStep = payload => {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    if (key === 'incomes') {
      payload[key].forEach(income => {
        formData.append('incomes', JSON.stringify(income));
      });
    } else {
      formData.append(key, payload[key]);
    }
  });

  return fetch(`${API_ROOT}/apply/application`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: formData
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_APPLICATION_STEP_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_APPLICATION_STEP_FAILURE,
      payload: {
        error: error.message,
        submittedValues: payload
      }
    };
  })
};

const fetchApplyUploadStep = payload => {
  const formData = new FormData();
  payload.files.forEach(file => {
    formData.append('files', file);
    formData.append('categories', file.category);
  })
  formData.append('application_id', payload.application_id);
  return fetch(`${API_ROOT}/apply/upload`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: formData
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_UPLOAD_STEP_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_UPLOAD_STEP_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

const fetchApplyConfirmStep = payload => {
  return fetch(`${API_ROOT}/apply/confirm`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_CONFIRM_STEP_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_CONFIRM_STEP_FAILURE,
      payload: {
        error: error.message,
        submittedValues: payload
      }
    };
  })
};


export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_APPLY:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(fetchGetApply)
      )
    case GET_APPLY_SUCCESS:
      if (payload.application && payload.application.status !== 'APPLYING') {
        return loop(
          state.set('isSubmitting', false),
          Effects.constant(push('/dashboard'))
        );
      } else {
        return state
          .set('isSubmitting', false)
          .set('application', payload.application)
          .set('profile', payload.profile)
          .delete('error');
      }
    case GET_APPLY_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_APPLY_REGISTER_STEP:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyRegisterStep,
          payload
        )
      );
    case SUBMIT_APPLY_REGISTER_STEP_SUCCESS:
      sessionStorage.setItem('jwtToken', payload.token);
       return state
        .set('isAuthenticated', true)
        .set('isSubmitting', false)
        .set('application', payload.application)
        .set('profile', payload.profile)
        .delete('error');
    case SUBMIT_APPLY_REGISTER_STEP_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error)
        .set('submittedValues', payload.submittedValues);
    case SUBMIT_APPLY_APPLICATION_STEP:
      payload.application_id = state.get('application').id
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyApplicationStep,
          payload
        )
      )
    case SUBMIT_APPLY_APPLICATION_STEP_SUCCESS:
      return state
        .set('application', payload.application)
        .set('profile', payload.profile)
        .set('isSubmitting', false)
        .delete('error');
    case SUBMIT_APPLY_APPLICATION_STEP_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error)
        .set('submittedValues', payload.submittedValues);
    case SUBMIT_APPLY_UPLOAD_STEP:
      payload.application_id = state.get('application').id
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyUploadStep,
          payload
        )
      )
    case SUBMIT_APPLY_UPLOAD_STEP_SUCCESS:
      return state
        .set('application', payload.application)
        .set('profile', payload.profile)
        .set('isSubmitting', false)
        .delete('error');
    case SUBMIT_APPLY_UPLOAD_STEP_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_APPLY_CONFIRM_STEP:
      payload.application_id = state.get('application').id
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyConfirmStep,
          payload
        )
      )
    case SUBMIT_APPLY_CONFIRM_STEP_SUCCESS:
      return state
        .set('application', payload)
        .set('isSubmitting', false)
        .delete('error');
    case SUBMIT_APPLY_CONFIRM_STEP_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}
