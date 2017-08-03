import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';
import {push} from 'react-router-redux';

import {handleError} from '../utils/fetcher-utils';

// ACTIONS
const GET_CHECKOUT = 'GET_CHECKOUT';
const GET_CHECKOUT_SUCCESS = 'GET_CHECKOUT_SUCCESS';
const GET_CHECKOUT_FAILURE = 'GET_CHECKOUT_FAILURE';

// CREATORS
export const getCheckout = () => ({
  type: GET_CHECKOUT
});

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  error: null
});

// FETCHERS
const fetchGetCheckout = () => {

}