import React from 'react';
import {reduxForm} from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';

import {constants} from '../../utils/style-utils';

const VerifyEmailForm = props => {
  const {handleSubmit, submitResendEmailVerification} = props;
  const error = props.verifyEmail.get('error');

  const ErrorMessage = styled.div`
    padding-top: 5px;
    padding-bottom: 5px;
    color: ${constants.red};
    text-transform: capitalize;
  `;

  return (
    <div>
      <ErrorMessage>{error}</ErrorMessage>
      <form onSubmit={handleSubmit(submitResendEmailVerification)}>
        <FlatButton label='Resend Email Verification' primary={true} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'verifyEmail'
})(VerifyEmailForm);
