import React from 'react';
import styled from 'styled-components';
import Divider from 'material-ui/Divider';
import {blue50, blue700, grey200, grey500, grey700} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import RaisedButton from 'material-ui/RaisedButton';

const generateRow = (title, value, description) => {
  return (
    <TableRow>
      <TableRowColumn style={{width: '30%', borderColor: grey200, verticalAlign: 'top', whiteSpace: 'normal', wordWrap: 'break-word'}}>
        <span style={{color: grey500, fontSize: '16px'}}>{title}</span><br />
        <span style={{fontWeight: 'light', fontSize: '24px', color: blue700}}>{value}</span>
      </TableRowColumn>
      <TableRowColumn style={{borderColor: grey200, wordWrap: 'break-word', whiteSpace: 'normal', verticalAlign: 'top', fontSize: '16px', color: grey500}}>
        {description} 
      </TableRowColumn>
    </TableRow>
  );
}

const LoanOffer = ({loanOffer, nextStep}) => {
  return (
    <div style={{width: '90%', margin: '0 auto', textAlign: 'center'}}>
      <Card>
        <CardHeader 
          title={<span style={{fontSize: '18px', color: grey700}}>{`Wow! You're steps away from saving on your move-in costs!`}</span>} 
          style={{backgroundColor: blue50, textAlign: 'left'}} 
        />
        <Divider style={{backgroundColor: grey500}}/>
        <CardText style={{padding: '0px'}}>
          <Table selectable={false} multiSelectable={false} style={{border: 'none'}}>
            <TableBody displayRowCheckbox={false}>
              {generateRow('Monthly Payment:', `$${loanOffer.estimated_monthly_payment}`, 'This is the interest due to us each month. Your first payment is due one month after we wire money to you.')}
              {generateRow('Other Fees:', '$0', 'We don\'t charge random fees! Moving is plenty painful as it is.')}
              {generateRow('Total Loan Amount:', `$${loanOffer.principal_amount}`, `This is the amount of your deposit. Upon termination of your lease, this amount is due to us in full. Any amount not returned to us will convert into an installment loan that will be payable over the course of ${loanOffer.term_in_months} months. Read how you can minimize the chances of losing your security deposit here.`)}
              {generateRow('Total # of Payments:', `${loanOffer.term_in_months}`, 'This is the number of payments to be made over the course of your lease. Of course, if you want to extend your lease, just keep paying the low monthly payment amount listed above until you decide to move out.')}
              {generateRow('APR:', `${loanOffer.interest_rate/100}%`, 'This is the annual rate charged, equal to the totally yearly cost of your loan over the life of your lease. The APR x the total loan amount, divided by 12 = your monthly payment.')}
            </TableBody>
          </Table>
        </CardText>
        <CardActions>
          <RaisedButton style={{width: '80%'}} primary={true} onClick={() => {return nextStep({loanOfferId: loanOffer.id})}}>Looks Great!</RaisedButton>
        </CardActions>
      </Card>
    </div>
  );
}

export default LoanOffer;
