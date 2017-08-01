import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';
import {push} from 'react-router-redux';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const SUBMIT_ADDITIONAL_UPLOAD = 'SUBMIT_ADDITIONAL_UPLOAD';
const SUBMIT_ADDITIONAL_UPLOAD_SUCCESS = 'SUBMIT_ADDITIONAL_UPLOAD_SUCCESS';
const SUBMIT_ADDITIONAL_UPLOAD_FAILURE = 'SUBMIT_ADDITIONAL_UPLOAD_FAILURE';

// CREATORS

export const submitAdditionalUpload = payload => ({
  type: SUBMIT_ADDITIONAL_UPLOAD,
  payload
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchAdditionalUpload = payload => {
  const formData = new FormData();
  payload.files.forEach(file => {
    formData.append('files', file);
    formData.append('categories', file.category);
  })
  formData.append('application_id', payload.application_id);
  return fetch('http://localhost:4000/additional-uploads', {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: formData
  })
  .then(handleError)
  .then(response => {
    return {
      type: SUBMIT_ADDITIONAL_UPLOAD_SUCCESS,
      payload: response
    };
  })
  .catch(error => {
    return {
      type: SUBMIT_ADDITIONAL_UPLOAD_FAILURE,
      payload: {
        error: error.message
      }
    };
  })
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SUBMIT_ADDITIONAL_UPLOAD:
      debugger;
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          fetchAdditionalUpload,
          payload
        )
      )
    case SUBMIT_ADDITIONAL_UPLOAD_SUCCESS:
      return loop(
        state.set('isSubmitting', false).delete('error'),
        Effects.constant(push('/dashboard'))
      );
    case SUBMIT_ADDITIONAL_UPLOAD_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}