import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_UPLOAD = 'GET_UPLOAD';
const GET_UPLOAD_SUCCESS = 'GET_UPLOAD_SUCCESS';
const GET_UPLOAD_FAILURE = 'GET_UPLOAD_FAILURE';

// CREATORS
export const getUpload = uploadId => ({
  type: GET_UPLOAD,
  payload: {uploadId}
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null,
  upload: null
});

// FETCHERS
const getUploadFetcher = uploadId => {
  return fetch(`${API_ROOT}/uploads/${uploadId}/view`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(response => handleError(response, true))
  .then(response => {
    return {
      type: GET_UPLOAD_SUCCESS,
      payload: {
        upload: response
      }
    };
  })
  .catch(error => {
    return {
      type: GET_UPLOAD_FAILURE,
      payload: {
        error: error.message
      }
    };
  });
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_UPLOAD:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(
          getUploadFetcher,
          payload.uploadId
        )
      );
    case GET_UPLOAD_SUCCESS:
      return state
        .set('isSubmitting', false)
        .delete('error')
        .set('upload', URL.createObjectURL(payload.upload));
    case GET_UPLOAD_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}
