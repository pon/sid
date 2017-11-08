import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import styled from 'styled-components';

import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper';

import AttachMoneyIcon from 'material-ui/svg-icons/editor/attach-money';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import PersonIcon from 'material-ui/svg-icons/social/person';
import {blue500} from 'material-ui/styles/colors';

import DoneStep from './DoneStep';
import RegisterStep from './RegisterStep';
import ApplicationStep from './ApplicationStep';
import FinancialStep from './FinancialStep';
import ApplyUploadStep from './UploadStep';
import ApplyConfirmStepForm from './ConfirmStep';
import {
  getApply, 
  submitApplyRegisterStep, 
  submitApplyApplicationStep, 
  submitApplyFinancialStep,
  submitSaveFinancialCredential,
  submitApplyUploadStep, 
  submitApplyConfirmStep
} from '../../reducers/apply';

export class Apply extends Component {

  componentWillMount() {
    return this.props.getApply();
  }

  render () {
    let applyStepIndex;
    let applyStep;

    const application = this.props.apply.get('application');

    if (this.props.apply.get('newApp')) {
      applyStepIndex = 0;
      applyStep = <RegisterStep apply={this.props.apply} submitApplyRegisterStep={this.props.submitApplyRegisterStep}/>;
    } else if (application && application.current_step === 'APPLICATION_DETAILS') {
      applyStepIndex = 1;
      applyStep = <ApplicationStep apply={this.props.apply} submitApplyApplicationStep={this.props.submitApplyApplicationStep}/>;
    } else if (application && application.current_step === 'FINANCIAL') {
      applyStepIndex = 2;
      applyStep = <FinancialStep submitSaveFinancialCredential={this.props.submitSaveFinancialCredential} financialCredentials={application.financial_credentials} submitApplyFinancialStep={this.props.submitApplyFinancialStep} />
    } else if (application && application.current_step === 'DOCUMENT_UPLOAD') {
      applyStepIndex = 3;
      applyStep = <ApplyUploadStep apply={this.props.apply} submitApplyUploadStep={this.props.submitApplyUploadStep}/>;
    } else if (application && application.current_step === 'CONFIRM') {
      applyStepIndex = 4;
      applyStep = <ApplyConfirmStepForm apply={this.props.apply} submitApplyConfirmStep={this.props.submitApplyConfirmStep}/>;
    } else if (application && application.status !== 'APPLYING') {
      applyStep = <DoneStep />
    }

    const ApplyWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    return (
      <ApplyWrapper>
        <Stepper linear={false} activeStep={applyStepIndex}>
          <Step>
            <StepLabel icon={<EmailIcon color={applyStepIndex === 0 ? blue500 : ''}/>}>Register</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<PersonIcon color={applyStepIndex === 1 ? blue500 : ''}/>}>Application</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<AttachMoneyIcon color={applyStepIndex === 2 ? blue500 : ''}/>}>Financial</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<FileUploadIcon color={applyStepIndex === 3 ? blue500 : ''}/>}>Document Upload</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<CheckCircleIcon color={applyStepIndex === 4 ? blue500 : ''}/>}>Confirm</StepLabel>
          </Step>
        </Stepper>
        {applyStep}
      </ApplyWrapper>
    )
  }
}

const mapStateToProps = ({apply}) => ({
  apply
})

const mapDispatchToProps = (dispatch) => ({
  getApply: () => {
    return dispatch(getApply());
  },
  submitApplyRegisterStep: payload => {
    return dispatch(submitApplyRegisterStep(payload));
  },
  submitApplyApplicationStep: payload => {
    return dispatch(submitApplyApplicationStep(payload));
  },
  submitApplyFinancialStep: () => {
    return dispatch(submitApplyFinancialStep());
  },
  submitSaveFinancialCredential: payload => {
    return dispatch(submitSaveFinancialCredential(payload));
  },
  submitApplyUploadStep: payload => {
    return dispatch(submitApplyUploadStep(payload));
  },
  submitApplyConfirmStep: payload => {
    return dispatch(submitApplyConfirmStep(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Apply);
