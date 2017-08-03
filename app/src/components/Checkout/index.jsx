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

export class Checkout extends Component {
  render () {
    let checkoutStepIndex;
    let checkoutStep;

    const CheckoutWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    checkoutStepIndex = 0;

    return (
      <CheckoutWrapper>
        <Stepper linear={false} activeStep={checkoutStepIndex}>
          <Step>
            <StepLabel icon={<InsertDriveIcon color={checkoutStepIndex === 0 ? blue500 : ''}/>}>Your Offer</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<HomeIcon color={checkoutStepIndex === 1 ? blue500 : ''}/>}>Landlord</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<CreditCardIcon color={checkoutStepIndex === 2 ? blue500 : ''}/>}>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<EditIcon color={checkoutStepIndex === 2 ? blue500 : ''}/>}>Sign</StepLabel>
          </Step>
        </Stepper>
      </CheckoutWrapper>
    )
  }
}

export default Checkout;