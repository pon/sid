import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';

import IncomeCard from './IncomeCard';

const IncomeSection = ({incomes, successMessage, unverifyIncome, verifyIncome, style}) => {
  return (
    <div style={style}>
      <h3>Incomes</h3>
      <div>
        {incomes.map(income => {
          return (<IncomeCard key={income.id} income={income} verifyIncome={verifyIncome} unverifyIncome={unverifyIncome}/>);
        })}
      </div>
    </div>
  );
}

export default IncomeSection;