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

import EmailIcon from 'material-ui/svg-icons/communication/email';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import PersonIcon from 'material-ui/svg-icons/social/person';
import {blue500} from 'material-ui/styles/colors';

import ApplyStepOneForm from './ApplyStepOne';
import ApplyStepTwoForm from './ApplyStepTwo';
import ApplyStepThreeForm from './ApplyStepThree';
import ApplyStepFourForm from './ApplyStepFour';
import {getApply, submitApplyStepOne, submitApplyStepTwo, submitApplyStepThree, submitApplyStepFour} from '../../reducers/apply';

const StepFourWrapper = styled.div`
  margin: 0 auto;
  width: 50%;
`;

export class Apply extends Component {

  componentWillMount() {
    return this.props.getApply();
  }

  render () {
    let applyStepIndex;
    let applyStep;

    const application = this.props.apply.get('application');

    if (application && application.status !== 'APPLYING') {
      applyStep =
        <StepFourWrapper>
          <h3>Thank you for applying!</h3>
          <Link to='/dashboard'><FlatButton label="Return to Dashboard" primary={true} /></Link>
        </StepFourWrapper>
    } else if (!this.props.apply.get('profile')) {
      applyStepIndex = 0;
      applyStep = <ApplyStepOneForm apply={this.props.apply} submitApplyStepOne={this.props.submitApplyStepOne}/>;
    } else if (application && (application.incomes.length === 0 || !application.lease)) {
      applyStepIndex = 1;
      applyStep = <ApplyStepTwoForm apply={this.props.apply} submitApplyStepTwo={this.props.submitApplyStepTwo}/>;
    } else if (application && application.uploads.length === 0) {
      applyStepIndex = 2;
      applyStep = <ApplyStepThreeForm apply={this.props.apply} submitApplyStepThree={this.props.submitApplyStepThree}/>;
    } else {
      applyStepIndex = 3;
      applyStep = <ApplyStepFourForm apply={this.props.apply} submitApplyStepFour={this.props.submitApplyStepFour}/>;
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
            <StepLabel icon={<FileUploadIcon color={applyStepIndex === 2 ? blue500 : ''}/>}>Document Upload</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<CheckCircleIcon color={applyStepIndex === 3 ? blue500 : ''}/>}>Confirm</StepLabel>
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
  submitApplyStepOne: payload => {
    return dispatch(submitApplyStepOne(payload));
  },
  submitApplyStepTwo: payload => {
    return dispatch(submitApplyStepTwo(payload));
  },
  submitApplyStepThree: payload => {
    return dispatch(submitApplyStepThree(payload));
  },
  submitApplyStepFour: payload => {
    return dispatch(submitApplyStepFour(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Apply);
