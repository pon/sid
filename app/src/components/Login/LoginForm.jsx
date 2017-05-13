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

  if(!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const LoginForm = props => {
  const {handleSubmit, pristine, submitting, submitLogin, valid} = props;
  const error = props.login.get('error');
  return (
    <div>
      <h1>Login</h1>
      <span>{error}</span>
      <form onSubmit={handleSubmit(submitLogin)}>
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
          <button type="submit" disabled={!valid || pristine || submitting}>Login</button>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'login',
  validate
})(LoginForm);