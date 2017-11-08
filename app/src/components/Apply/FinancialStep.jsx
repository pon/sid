import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {PLAID_CREDENTIALS} from '../../config';

import AddIcon from 'material-ui/svg-icons/content/add';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AttachMoneyIcon from 'material-ui/svg-icons/editor/attach-money';
import HourglassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

const ApplyFinancialStepForm = props => {
  const {financialCredentials, submitSaveFinancialCredential, submitApplyFinancialStep} = props;

  const wrapperStyles = {width: '60%', margin: '0 auto', marginBottom: '1em'};
  const centeredContent = {textAlign: 'center'};

  const linkHandler = window.Plaid.create({
    env: PLAID_CREDENTIALS.env,
    clientName: PLAID_CREDENTIALS.clientName,
    // Replace '<PUBLIC_KEY>' with your own `public_key`
    key: PLAID_CREDENTIALS.key,
    product: ['auth'],
    // Use webhooks to get transaction and error updates
    // webhook: 'localhost:5000/financial/credentials',
    onSuccess: function(public_token, metadata) {
      submitSaveFinancialCredential({
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
      <div style={centeredContent}>
        <h4>Financial Accounts</h4>
      </div>
      <List>
        {financialCredentials.map(financialCredential => {
          return (
            <ListItem 
              key={financialCredential.id}
              primaryText={financialCredential.institution_name} 
              leftIcon={<AttachMoneyIcon />}
              rightIcon={financialCredential.financial_accounts.length === 0 ? <HourglassIcon /> : <ArrowDownIcon />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={financialCredential.financial_accounts.map(acct => 
                <ListItem key={acct.id} primaryText={acct.name} />
              )}
            />
          ) 
        })}        
      </List>
      <div style={centeredContent}>
        <RaisedButton onClick={() => linkHandler.open()} label={<AddIcon />} />
      </div>
      <br />
      <Divider />
      <br />
      <div style={centeredContent}>
        <RaisedButton primary={true} onClick={() => submitApplyFinancialStep()} label="I'm Done Connecting Accounts" />
      </div>
    </div>
  );
}

export default ApplyFinancialStepForm;
