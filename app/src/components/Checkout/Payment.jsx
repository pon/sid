import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {grey100} from 'material-ui/styles/colors';
import {SelectField} from 'redux-form-material-ui';

import Faq from '../common/Faq';

const PaymentForm = props => {
  const {financialAccounts, handleSubmit, submitCheckoutPayment} = props;

  const wrapperStyles = {width: '85%', margin: '0 auto', marginBottom: '1em'};

  const generateAccountDisplay = account => {
    return `${account.institution_name} - ${account.name} (xxxx${account.account_number_last_4})`;
  }

  return (
    <div style={wrapperStyles}>
      <Faq
        header={<span>{`Almost there! You need to select a payment method.`}</span>}
        body={<span>{`To make things easy - choose one of the accounts you connected during the application process. We'll automatically take the interest payment out of your account each month so you don't need to worry about scheduling it!`}</span>}
      />
      <br />
      <form onSubmit={handleSubmit(submitCheckoutPayment)}>
        <Card>
          <CardHeader title={<h5>Select Payment Account</h5>} style={{backgroundColor: grey100}} />
          <CardText>
            <Field name="existing_account" fullWidth={true} component={SelectField} hintText="Account">
              {
                financialAccounts.map(account => {
                  return (
                    <MenuItem 
                      key={account.account_id} 
                      value={account.account_id} 
                      primaryText={generateAccountDisplay(account)} 
                    />
                  );
                })
              } 
            </Field>
          </CardText>
          <CardActions style={{textAlign: 'center'}}>
            <RaisedButton style={{width: '50%'}} label="Submit" primary={true} type="submit"/>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'payment'
})(PaymentForm);
