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
import {getCheckout} from '../../reducers/checkout';

export class Checkout extends Component {

  constructor() {
    super();
    this.state = {
      checkoutStepIndex: 0
    }
  }

  componentWillMount() {
    return this.props.getCheckout();
  }

  render () {
    let checkoutStep;

    const CheckoutWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    const loanOffer = this.props.checkout.get('loan_offer');
    const payoffDetails = this.props.checkout.get('payoff_details');
    const paymentAccount = this.props.checkout.get('payment_account');

    if (this.state.checkoutStepIndex === 1) {
      checkoutStep = <PayoffDetails></PayoffDetails>
    } else if (!payoffDetails) {
      checkoutStep = <LoanOffer loanOffer={loanOffer} nextStep={() => {this.setState({checkoutStepIndex: 1})}}/>
    } else if (this.state.checkoutStepIndex === 1) {
    } else if (payoffDetails && !paymentAccount) {
      this.setState({checkoutStepIndex: 2})
    } else if (payoffDetails && paymentAccount) {
      this.setState({checkoutStepIndex: 3})
    }

    return (
      <CheckoutWrapper>
        <Stepper linear={false} activeStep={this.state.checkoutStepIndex}>
          <Step>
            <StepLabel icon={<InsertDriveIcon color={this.state.checkoutStepIndex === 0 ? blue500 : ''}/>}>Your Offer</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<HomeIcon color={this.state.checkoutStepIndex === 1 ? blue500 : ''}/>}>Payoff Details</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<CreditCardIcon color={this.state.checkoutStepIndex === 2 ? blue500 : ''}/>}>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<EditIcon color={this.state.checkoutStepIndex === 3 ? blue500 : ''}/>}>Sign</StepLabel>
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);