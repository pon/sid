import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';

import RenderField from '../common/RenderField';

import {constants} from '../../utils/style-utils';

const validate = values => {
  const errors = {};

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'Must be at least 8 characters';
  } else if (!values.passwordConfirmation) {
    errors.passwordConfirmation = 'Required';
  } else if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Must match password';
  }

  return errors;
}

const FormError = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  color: ${constants.red}
`;

const AcceptInviteForm = props => {
  const {handleSubmit, pristine, submitting, submitAcceptInvitation, valid} = props;
  const error = props.acceptInvite.get('error');
  return (
    <form onSubmit={handleSubmit(submitAcceptInvitation)}>
      <h3>Accept Your Invitation</h3>
      <FormError>{error}</FormError>
      <Field name="password" fullWidth={true} component={TextField} type="password" floatingLabelText="Password" hintText="Password"/>
      <Field name="passwordConfirmation" fullWidth={true} component={TextField} type="password" floatingLabelText="Password Confirmation" hintText="Password Confirmation"/>
      <br />
      <FlatButton label="Accept Invite" primary={true} type="submit" disabled={!valid || pristine || submitting}/>
    </form>
  );
}

export default reduxForm({
  form: 'acceptInvite',
  validate
})(AcceptInviteForm);