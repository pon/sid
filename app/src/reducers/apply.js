import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const GET_APPLY = 'GET_APPLY';
const GET_APPLY_SUCCESS = 'GET_APPLY_SUCCESS';
const GET_APPLY_FAILURE = 'GET_APPLY_FAILURE';
const SUBMIT_APPLY_STEP_ONE = 'SUBMIT_APPLY_STEP_ONE';
const SUBMIT_APPLY_STEP_ONE_SUCCESS = 'SUBMIT_APPLY_STEP_ONE_SUCCESS';
const SUBMIT_APPLY_STEP_ONE_FAILURE = 'SUBMIT_APPLY_STEP_ONE_FAILURE';
const SUBMIT_APPLY_STEP_TWO = 'SUBMIT_APPLY_STEP_TWO';
const SUBMIT_APPLY_STEP_TWO_SUCCESS = 'SUBMIT_APPLY_STEP_TWO_SUCCESS';
const SUBMIT_APPLY_STEP_TWO_FAILURE = 'SUBMIT_APPLY_STEP_TWO_FAILURE';
const SUBMIT_APPLY_STEP_THREE = 'SUBMIT_APPLY_STEP_THREE';
const SUBMIT_APPLY_STEP_THREE_SUCCESS = 'SUBMIT_APPLY_STEP_THREE_SUCCESS';
const SUBMIT_APPLY_STEP_THREE_FAILURE = 'SUBMIT_APPLY_STEP_THREE_FAILURE';
const SUBMIT_APPLY_STEP_FOUR = 'SUBMIT_APPLY_STEP_FOUR';
const SUBMIT_APPLY_STEP_FOUR_SUCCESS = 'SUBMIT_APPLY_STEP_FOUR_SUCCESS';
const SUBMIT_APPLY_STEP_FOUR_FAILURE = 'SUBMIT_APPLY_STEP_FOUR_FAILURE';


// CREATORS
export const getApply = () => ({
  type: GET_APPLY
})

export const submitApplyStepOne = payload => ({
  type: SUBMIT_APPLY_STEP_ONE,
  payload
});

export const submitApplyStepTwo = payload => ({
  type: SUBMIT_APPLY_STEP_TWO,
  payload
});

export const submitApplyStepThree = payload => ({
  type: SUBMIT_APPLY_STEP_THREE,
  payload
});

export const submitApplyStepFour = payload => ({
  type: SUBMIT_APPLY_STEP_FOUR,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchGetApply = () => {
  return fetch(`http://localhost:4000/apply`, {
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

const fetchApplyStepOne = payload => {
  return fetch('http://localhost:4000/apply/step-one', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_STEP_ONE_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_STEP_ONE_FAILURE,
      payload: {
        error: error.message,
        submittedValues: payload
      }
    };
  })
};

const fetchApplyStepTwo = payload => {
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

  return fetch('http://localhost:4000/apply/step-two', {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: formData
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_STEP_TWO_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_STEP_TWO_FAILURE,
      payload: {
        error: error.message,
        submittedValues: payload
      }
    };
  })
};

const fetchApplyStepThree = payload => {
  const formData = new FormData();
  payload.files.forEach(file => {
    formData.append('files', file);
    formData.append('categories', file.category);
  })
  formData.append('application_id', payload.application_id);
  return fetch('http://localhost:4000/apply/step-three', {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: formData
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_STEP_THREE_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_STEP_THREE_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

const fetchApplyStepFour = payload => {
  console.log(payload);
  return fetch('http://localhost:4000/apply/step-four', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_APPLY_STEP_FOUR_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_APPLY_STEP_FOUR_FAILURE,
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
      return state
        .set('isSubmitting', false)
        .set('application', payload.application)
        .set('profile', payload.profile)
        .delete('error');
    case GET_APPLY_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_APPLY_STEP_ONE:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyStepOne,
          payload
        )
      );
    case SUBMIT_APPLY_STEP_ONE_SUCCESS:
      sessionStorage.setItem('jwtToken', payload.token);
       return state
        .set('isAuthenticated', true)
        .set('isSubmitting', false)
        .set('application', payload.application)
        .set('profile', payload.profile)
        .delete('error');
    case SUBMIT_APPLY_STEP_ONE_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error)
        .set('submittedValues', payload.submittedValues);
    case SUBMIT_APPLY_STEP_TWO:
      payload.application_id = state.get('application').id
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyStepTwo,
          payload
        )
      )
    case SUBMIT_APPLY_STEP_TWO_SUCCESS:
      return state
        .set('application', payload.application)
        .set('profile', payload.profile)
        .set('isSubmitting', false)
        .delete('error');
    case SUBMIT_APPLY_STEP_TWO_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error)
        .set('submittedValues', payload.submittedValues);
    case SUBMIT_APPLY_STEP_THREE:
      payload.application_id = state.get('application').id
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyStepThree,
          payload
        )
      )
    case SUBMIT_APPLY_STEP_THREE_SUCCESS:
      return state
        .set('application', payload.application)
        .set('profile', payload.profile)
        .set('isSubmitting', false)
        .delete('error');
    case SUBMIT_APPLY_STEP_THREE_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_APPLY_STEP_FOUR:
      payload.application_id = state.get('application').id
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchApplyStepFour,
          payload
        )
      )
    case SUBMIT_APPLY_STEP_FOUR_SUCCESS:
      return state
        .set('application', payload)
        .set('isSubmitting', false)
        .delete('error');
    case SUBMIT_APPLY_STEP_FOUR_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}