import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {PLAID_CREDENTIALS} from '../../config';

const ApplyFinancialStepForm = props => {
  const {handleSubmit, submitting, submitApplyFinancialStep, valid} = props;

  const wrapperStyles = {width: '60%', margin: '0 auto', marginBottom: '1em'};

  const linkHandler = window.Plaid.create({
    env: PLAID_CREDENTIALS.env,
    clientName: PLAID_CREDENTIALS.clientName,
    // Replace '<PUBLIC_KEY>' with your own `public_key`
    key: PLAID_CREDENTIALS.key,
    product: ['auth'],
    // Use webhooks to get transaction and error updates
    // webhook: 'localhost:5000/financial/credentials',
    onSuccess: function(public_token, metadata) {
      submitApplyFinancialStep({
        provider: 'PLAID',
        credentials: {
          public_token,
          metadata
        } 
      })
    },
    onExit: function(err, metadata) {
      // The user exited the Link flow.
      if (err != null) {
        // The user encountered a Plaid API error
        // prior to exiting.
      }
      // metadata contains information about the
      // institution that the user selected and the
      // most recent API request IDs. Storing this
      // information can be helpful for support.
    }
  });

  return (
    <div style={wrapperStyles}>
      <form>
        <h4>Financial Accounts</h4>
        <RaisedButton onClick={() => linkHandler.open()} label="Connect" />
        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-financial-step'
})(ApplyFinancialStepForm);
