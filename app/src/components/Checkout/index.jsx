import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper';

import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import HomeIcon from 'material-ui/svg-icons/action/home';
import InsertDriveIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import {blue500} from 'material-ui/styles/colors';

import LoanOffer from './LoanOffer';
import PayoffDetails from './PayoffDetails';
import Payment from './Payment';
import Sign from './Sign';

import {
  getCheckout, 
  submitCheckoutCompleteReviewOffer,
  submitCheckoutPayment,
  submitCheckoutPayoffDetails
} from '../../reducers/checkout';

export class Checkout extends Component {

  componentWillMount() {
    return this.props.getCheckout();
  }

  render () {
    let checkoutStep;
    let checkoutStepIndex;

    const CheckoutWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    const loanOffer = this.props.checkout.get('loan_offer');
    const financialAccounts = this.props.checkout.get('financial_accounts');
    const profile = this.props.checkout.get('profile');

    if (loanOffer && loanOffer.current_step === 'REVIEW_OFFER') {
      checkoutStepIndex = 0;
      checkoutStep = <LoanOffer loanOffer={loanOffer} nextStep={this.props.submitCheckoutCompleteReviewOffer}/>
    } else if (loanOffer && loanOffer.current_step === 'PAYOFF_DETAILS') {
      checkoutStepIndex = 1;
      checkoutStep = <PayoffDetails submitCheckoutPayoffDetails={this.props.submitCheckoutPayoffDetails}></PayoffDetails>
    } else if (loanOffer && loanOffer.current_step === 'PAYMENT') {
      checkoutStepIndex = 2;
      checkoutStep = <Payment financialAccounts={financialAccounts} submitCheckoutPayment={this.props.submitCheckoutPayment}/>
    } else if (loanOffer && loanOffer.current_step === 'SIGN') {
      checkoutStepIndex = 3;
      checkoutStep = <Sign loanOffer={loanOffer} profile={profile}/>
    }

    return (
      <CheckoutWrapper>
        <Stepper linear={false} activeStep={checkoutStepIndex}>
          <Step>
            <StepLabel icon={<InsertDriveIcon color={checkoutStepIndex === 0 ? blue500 : ''}/>}>Your Offer</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<HomeIcon color={checkoutStepIndex === 1 ? blue500 : ''}/>}>Deposit Payout Details</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<CreditCardIcon color={checkoutStepIndex === 2 ? blue500 : ''}/>}>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<EditIcon color={checkoutStepIndex === 3 ? blue500 : ''}/>}>Sign</StepLabel>
          </Step>
        </Stepper>
        {checkoutStep}
      </CheckoutWrapper>
    )
  }
}

const mapStateToProps = ({checkout}) => ({
  checkout
});

const mapDispatchToProps = (dispatch) => ({
  getCheckout: () => {
    return dispatch(getCheckout());
  },
  submitCheckoutCompleteReviewOffer: payload => {
    return dispatch(submitCheckoutCompleteReviewOffer(payload));
  },
  submitCheckoutPayoffDetails: payload => {
    return dispatch(submitCheckoutPayoffDetails(payload));
  },
  submitCheckoutPayment: payload => {
    return dispatch(submitCheckoutPayment(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
