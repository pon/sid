import React from 'react';

import FinancialCredentialCard from './FinancialCredentialCard';

const FinancialSection = ({financialCredentials, style}) => {
  return (
    <div style={style}>
      <h3>Connected Financial Accounts</h3>
      <div>
        {financialCredentials.map(credential => {
          return (<FinancialCredentialCard key={credential.id} style={{width: '30%'}} financialCredential={credential} />);
        })}
      </div>
    </div>
  );
}

export default FinancialSection;
