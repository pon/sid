import React from 'react';

import FinancialCredentialCard from './FinancialCredentialCard';

const FinancialSection = ({financialCredentials, style}) => {
  const cardStyle = {
    width: '30%',
    margin: '1%',
    float: 'left'
  };
  
  return (
    <div style={style}>
      <h3>Connected Financial Accounts</h3>
      <div>
        {financialCredentials.map(credential => {
          return (<FinancialCredentialCard key={credential.id} style={cardStyle} financialCredential={credential} />);
        })}
      </div>
    </div>
  );
}

export default FinancialSection;
