import React from 'react';
import {Field, reduxForm} from 'redux-form';

import RenderField from '../common/RenderField';

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid Email';
  }

  return errors;
}

const ForgotPasswordForm = props => {
  const {handleSubmit, pristine, submitting, submitForgotPassword, valid} = props;
  const error = props.forgotPassword.get('error');
  return (
    <div>
      <h1>Forgot Password</h1>
      <span>{error}</span>
      <form onSubmit={handleSubmit(submitForgotPassword)}>
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
          <button type="submit" disabled={!valid || pristine || submitting}>Forgot Password</button>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'forgotPassword',
  validate
})(ForgotPasswordForm);