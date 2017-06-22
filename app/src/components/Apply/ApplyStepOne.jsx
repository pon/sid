import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';

import GroupedError from '../common/GroupedError';
import RenderField from '../common/RenderField';
import StyledInput from '../common/StyledInput';
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
  } else if (values.password != values.confirm_password) {
    errors.confirm_password = 'Passwords must match';
  }

  return errors;
};

const StepOneWrapper = styled.div`
  width: 50%;
  margin: 0 auto;
  text-align: center;
`;

const ApplyStepOneForm = props => {
  const {apply, handleSubmit, pristine, submitting, submitApplyStepOne, valid} = props;
  const error = apply.get('error');
  return (
    <StepOneWrapper>
      <h2>Get Started</h2>
      <form onSubmit={handleSubmit(submitApplyStepOne)} className="pure-form">
        <fieldset className="pure-group">
          <Field className="pure-input-1" name="first_name" component={StyledInput} type="text" placeholder="First Name" />
          <Field className="pure-input-1" name="last_name" component={StyledInput} type="text" placeholder="Last Name" />
          <Field className="pure-input-1" name="email" component={StyledInput} type="email" placeholder="Email" />
        </fieldset>
        
        <fieldset className="pure-group">
          <Field className="pure-input-1" name="password" component={StyledInput} type="password" placeholder="Password" />
          <Field className="pure-input-1" name="confirm_password" component={StyledInput} type="password" placeholder="Confirm Password" />
        </fieldset>

        <Field name="password" component={GroupedError} />
        <Field name="confirm_password" component={GroupedError} />

        <button type="submit" disabled={!valid || pristine || submitting} className="pure-button pure-input-1 pure-button-primary pure-u-1">Submit</button>
      </form>
    </StepOneWrapper>
  );
}

export default reduxForm({
  form: 'apply-step-one',
  validate
})(ApplyStepOneForm);

