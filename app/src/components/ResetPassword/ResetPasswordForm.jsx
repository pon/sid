import React from 'react';
import {Field, reduxForm} from 'redux-form';

import RenderField from '../common/RenderField';

const validate = values => {
  const errors = {};

  if (!values.newPassword) {
    errors.newPassword = 'Required';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Must be at least 8 characters';
  } else if (!values.newPasswordConfirmation) {
    errors.newPasswordConfirmation = 'Required';
  } else if (values.newPassword !== values.newPasswordConfirmation) {
    errors.newPasswordConfirmation = 'Must match password';
  }

  return errors;
}

const ResetPasswordForm= props => {
  const {handleSubmit, pristine, submitting, submitResetPassword, valid} = props;
  const error = props.resetPassword.get('error');
  return (
    <div>
      <h1>Reset Password</h1>
      <span>{error}</span>
      <form onSubmit={handleSubmit(submitResetPassword)}>
        <div>
          <div>
            <Field
              name="token"
              component="input"
              type="hidden"
            />
          </div>
          <label>New Password</label>
          <div>
            <Field
              name="newPassword"
              component={RenderField}
              type="password"
            />
          </div>
          <label>New Password Confirmation</label>
          <div>
            <Field
              name="newPasswordConfirmation"
              component={RenderField}
              type="password"
            />
          </div>
        </div>
        <div>
          <button type="submit" disabled={!valid || pristine || submitting}>Reset Password</button>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'resetPassword',
  validate
})(ResetPasswordForm);
