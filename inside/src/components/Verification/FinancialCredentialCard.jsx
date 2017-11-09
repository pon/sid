import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import {green500} from 'material-ui/styles/colors';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';

const FinancialCredentialCard = ({financialCredential, style}) => {
  return (
    <Card style={style}>
      <CardHeader 
        title={<span><CheckBox  /> {financialCredential.institution_name}</span>} 
        style={{backgroundColor: green500}}
      />
      <CardText>
        <List>
          {financialCredential.financial_accounts.map(account => {
            return (
              <ListItem
                key={account.id}
                primaryText={
                  <div style={{width: '100%'}}>
                    <span>{account.name}</span> 
                    <span style={{float: 'right'}}>${account.current_balance}</span>
                  </div>
                }
              />
            );
          })}
        </List>
      </CardText>
    </Card>
  );
};

export default FinancialCredentialCard;
