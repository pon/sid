import React from 'react';
import styled from 'styled-components';

import RaisedButton from 'material-ui/RaisedButton';

const LoanOfferWrapper = styled.div`
  width: 50%;
  margin: 0 auto;
  text-align: center;
`;

const LoanOffer = ({loanOffer, nextStep}) => {
  return (
    <LoanOfferWrapper>
      <h2>Your Offer</h2>
      <h4>${loanOffer && loanOffer.principal_amount} at {loanOffer && loanOffer.interest_rate / 100}% over {loanOffer && loanOffer.term_in_months} Months</h4>
      <h5>Expires @ {loanOffer && loanOffer.expires_at}</h5>
      <br />
      <RaisedButton primary={true} onClick={() => {return nextStep({loanOfferId: loanOffer.id})}}>Continue</RaisedButton>
    </LoanOfferWrapper>
  );
}

export default LoanOffer;
