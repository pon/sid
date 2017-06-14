import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';

import RenderField from '../common/RenderField';

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid Email';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'Must be at least 8 characters';
  } else if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  } else if (values.password != values.confirmPassword) {
    errors.confirmPassword = 'Must match password';
  }

  return errors;
};

const RegisterForm = props => {
  const {handleSubmit, pristine, submitting, submitRegister, valid} = props;
  const error = props.register.get('error');
  return (
    <div>
      <h1>Register</h1>
      <span>{error}</span>
      <form onSubmit={handleSubmit(submitRegister)}>
        <div>
          <label>Email</label>
          <div>
            <Field
              name="email"
              component={RenderField}
              type="email"
              placeholder="Email"
            />
          </div>
        </div>
        <div>
          <label>Password</label>
          <div>
            <Field
              name="password"
              component={RenderField}
              type="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div>
          <label>Confirm Password</label>
          <div>
            <Field
              name="confirmPassword"
              component={RenderField}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div>
          <button type="submit" disabled={!valid || pristine || submitting}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'register',
  validate
})(RegisterForm);
