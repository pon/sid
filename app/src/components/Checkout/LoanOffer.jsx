import React from 'react';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {green50, green100} from 'material-ui/styles/colors';

import RaisedButton from 'material-ui/RaisedButton';

const LoanOfferWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
  text-align: center;
`;

const LoanOffer = ({loanOffer, nextStep}) => {
  return (
    <LoanOfferWrapper>
      <Paper style={{
        paddingTop: '10px', 
        fontSize: '16px', 
        backgroundColor: green50, 
        height: '500px',
        borderStyle: 'solid',
        borderWidth: '1.5px',
        borderColor: green100
      }}>
        <p style={{fontSize: '24px'}}>Congratulations!</p>
        <Divider style={{backgroundColor: green100}}/>
        <p style={{paddingTop: '10px', textAlign: 'left', paddingRight: '10px', paddingLeft: '10px'}}>
          <h4>Fees: $0</h4>
          <h4>{`Monthly Payment: $${loanOffer.estimated_monthly_payment}`}</h4>
          <h4>{`Number of Payments: ${loanOffer.term_in_months}`}</h4>
          <h4>{`Total Loan Amount: $${loanOffer.principal_amount}`}</h4>
          <h4>{`APR: ${loanOffer.interest_rate/100}%`}</h4>
        </p>
      </Paper>
      <br />
      <RaisedButton style={{width: '80%'}} primary={true} onClick={() => {return nextStep({loanOfferId: loanOffer.id})}}>Continue</RaisedButton>
    </LoanOfferWrapper>
  );
}

export default LoanOffer;
