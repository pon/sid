import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import styled from 'styled-components';

import RaisedButton from 'material-ui/RaisedButton';
import {TextField} from 'redux-form-material-ui';

import {constants} from '../../utils/style-utils';

const validate = values => {
  const errors = {};

  if (!values.first_name) {
    errors.first_name = 'Required';
  }

  if (!values.last_name) {
    errors.last_name = 'Required';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid Email';
  }

  if (!values.password) {
    errors.password = '';
  } else if (values.password.length < 8) {
    errors.password = 'Must be at least 8 characters';
  } else if (!values.confirm_password) {
    errors.confirm_password = '';
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Passwords must match';
  }

  return errors;
};

const RegisterStepWrapper = styled.div`
  width: 50%;
  margin: 0 auto;
  text-align: center;
`;

const FormError = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  color: ${constants.red}
`;

let ApplyRegisterStepForm = props => {
  const {apply, handleSubmit, pristine, submitting, submitApplyRegisterStep, valid} = props;
  const error = apply.get('error');
  return (
    <RegisterStepWrapper>
      <h2>Get Started</h2>
      <form onSubmit={handleSubmit(submitApplyRegisterStep)}>
        <FormError>{error}</FormError>
        <Field name="first_name" fullWidth={true} component={TextField} hintText="First Name" floatingLabelText="First Name"/>
        <Field name="last_name" fullWidth={true} component={TextField} hintText="Last Name" floatingLabelText="Last Name"/>
        <Field name="email" fullWidth={true} component={TextField} hintText="Email" floatingLabelText="Email" />
        <Field name="password" fullWidth={true} component={TextField} type="password" hintText="Password" floatingLabelText="Password" />
        <Field name="confirm_password" fullWidth={true} component={TextField} type="password" hintText="Confirm Password" floatingLabelText="Confirm Password" />
        <br />
        <RaisedButton label="Submit" primary={true} disabled={!valid || pristine || submitting} type="submit"/>
      </form>
    </RegisterStepWrapper>
  );
}

ApplyRegisterStepForm = reduxForm({
  form: 'apply-register-step',
  validate
})(ApplyRegisterStepForm);

ApplyRegisterStepForm = connect(
  ({apply}) => {
    return {
      initialValues: apply.get('submittedValues')
    };
  }
)(ApplyRegisterStepForm);

export default ApplyRegisterStepForm;
