import Immutable from 'immutable';
import {Effects, loop} from 'redux-loop';

import {handleError} from '../utils/fetcher-utils';

import {API_ROOT} from '../config';

// ACTIONS
const GET_CHECKOUT = 'GET_CHECKOUT';
const GET_CHECKOUT_SUCCESS = 'GET_CHECKOUT_SUCCESS';
const GET_CHECKOUT_FAILURE = 'GET_CHECKOUT_FAILURE';
const SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER = 'SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER';
const SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_SUCCESS = 'SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_SUCCESS';
const SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_FAILURE = 'SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_FAILURE';

// CREATORS
export const getCheckout = () => ({
  type: GET_CHECKOUT
});

export const submitCheckoutCompleteReviewOffer = payload => ({
  type: SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER,
  payload
})

// REDUCER
export const initialState = Immutable.fromJS({
  isSubmitting: false,
  loan_offer: null,
  payoff_details: null,
  payment_account: null,
  error: null
});

// FETCHERS
const fetchGetCheckout = () => {
  return fetch(`${API_ROOT}/checkout`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    }
  })
  .then(handleError)
  .then(response => ({
    type: GET_CHECKOUT_SUCCESS,
    payload: response
  }))
  .catch(error => ({
    type: GET_CHECKOUT_FAILURE,
    payload: {
      error: error.message
    }
  }));
};

const fetchSubmitCheckoutCompleteReviewOffer = payload => {
  return fetch(`${API_ROOT}/checkout/complete-review-offer`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('jwtToken')
    },
    body: JSON.stringify({loan_offer_id: payload.loanOfferId})
  })
  .then(handleError)
  .then(response => ({
    type: SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_SUCCESS,
    payload: response
  }))
  .catch(error => ({
    type: SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_FAILURE,
    payload: {
      error: error.message
    }
  }));
};


export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_CHECKOUT:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(fetchGetCheckout)
      )
    case GET_CHECKOUT_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('loan_offer', payload.loan_offer)
        .set('payoff_details', payload.payoff_details)
        .set('payment_account', payload.payment_account)
        .delete('error');
    case GET_CHECKOUT_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    case SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER:
      return loop(
        state.set('isSubmitting', true),
        Effects.promise(fetchSubmitCheckoutCompleteReviewOffer, payload)
      );
    case SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_SUCCESS:
      return state
        .set('isSubmitting', false)
        .set('loan_offer', payload.loan_offer)
        .set('payoff_details', payload.payoff_details)
        .set('payment_account', payload.payment_account)
        .delete('error');
    case SUBMIT_CHECKOUT_COMPLETE_REVIEW_OFFER_FAILURE:
      return state
        .set('isSubmitting', false)
        .set('error', payload.error);
    default:
      return state;
  }
}
