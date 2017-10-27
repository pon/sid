import React from 'react';

import IncomeCard from './IncomeCard';

const IncomeSection = ({editable, incomes, successMessage, unverifyIncome, verifyIncome, style}) => {
  return (
    <div style={style}>
      <h3>Incomes</h3>
      <div>
        {incomes.map(income => {
          return (<IncomeCard key={income.id} editable={editable} income={income} verifyIncome={verifyIncome} unverifyIncome={unverifyIncome}/>);
        })}
      </div>
    </div>
  );
}

export default IncomeSection;
