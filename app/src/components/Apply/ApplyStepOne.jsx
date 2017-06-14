import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';

import RenderField from '../common/RenderField';

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
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'Must be at least 8 characters';
  } else if (!values.confirm_password) {
    errors.confirm_password = 'Required';
  } else if (values.password != values.confirm_password) {
    errors.confirm_password = 'Must match password';
  }

  return errors;
};

const ApplyStepOneForm = props => {
  const {handleSubmit, pristine, submitting, submitApplyStepOne, valid} = props;
  const error = props.apply.get('error');
  return (
    <div>
      <span>{error}</span>
      <form onSubmit={handleSubmit(submitApplyStepOne)}>
        <div>
          <label>First Name</label>
          <div>
            <Field
              name="first_name"
              component={RenderField}
              type="text"
              placeholder="First Name"
            />
          </div>
        </div>
        <div>
          <label>Last Name</label>
          <div>
            <Field
              name="last_name"
              component={RenderField}
              type="text"
              placeholder="Last Name"
            />
          </div>
        </div>
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
              name="confirm_password"
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
  form: 'apply-step-one',
  validate
})(ApplyStepOneForm);

