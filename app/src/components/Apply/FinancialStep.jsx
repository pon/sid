import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {PLAID_CREDENTIALS} from '../../config';

import AddIcon from 'material-ui/svg-icons/content/add';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AttachMoneyIcon from 'material-ui/svg-icons/editor/attach-money';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import HourglassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import {grey100} from 'material-ui/styles/colors';

import Faq from './Faq';

const ApplyFinancialStepForm = props => {
  const {financialCredentials, submitSaveFinancialCredential, submitApplyFinancialStep} = props;

  const wrapperStyles = {width: '80%', margin: '0 auto', marginBottom: '1em'};

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
      <Faq 
        header={<span>Why are you asking me to connect my financial accounts?</span>}
        body={<span>Please connect your primary checking account where you deposit your paychecks. This will allow us verify your salary and income information without asking you to provide additional documents. You should also connect any additional accounts (e.g. retirement and brokerage) that will give us a more holistic view of your financial profile. We value your financial security about all else and will at no point store your username or password in our system. For more information please consult our <a href="https://www.poplar.co/privacy-policy/">Privacy Policy</a> and <a href="https://www.poplar.co/terms-of-service/">Terms of Service</a>.</span>}
      />
      <br />
      <Card>
        <CardHeader title="Connected Financial Accounts" style={{backgroundColor: grey100}}/>
        <Divider />
        <CardText>
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
        </CardText>
        <CardActions style={{width: '100%', textAlign: 'center', backgroundColor: grey100}}>
          <RaisedButton onClick={() => linkHandler.open()} label={<AddIcon />} />
        </CardActions>
      </Card>
      <br />
      <div style={{float: 'right'}}>
        <RaisedButton primary={true} onClick={() => submitApplyFinancialStep()} label="I'm Done Connecting Accounts" />
      </div>
    </div>
  );
}

export default ApplyFinancialStepForm;
