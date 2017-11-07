import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';
import {TextField} from 'redux-form-material-ui';

import {constants} from '../../utils/style-utils';

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid Email';
  }

  if(!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const FormError = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  color: ${constants.red}
`;

const LoginWrapper = styled.div`
  width: 25%;
  margin: 0 auto;
  text-align: center;
`;

const LoginForm = props => {
  const {handleSubmit, pristine, submitting, submitLogin, valid} = props;
  const error = props.login.get('error');
  return (
    <LoginWrapper>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(submitLogin)}>
        <FormError>{error}</FormError>
        <Field name="email" fullWidth={true} component={TextField} floatingLabelText="Email" />
        <Field name="password" fullWidth={true} component={TextField} hintText="Password" floatingLabelText="Password" type="password" />
        <Field name="nextPath" component="input" type="hidden" />
        <button type="submit" disabled={!valid || pristine || submitting}>Login</button>
      </form>
    </LoginWrapper>
  );
}

export default reduxForm({
  form: 'login',
  validate
})(LoginForm);
