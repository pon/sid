import React from 'react';
import {Field, reduxForm} from 'redux-form';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {TextField} from 'redux-form-material-ui';
import {blue100, blue500, green100, green500} from 'material-ui/styles/colors';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const validate = values => {
  const errors = {};

  return errors;
};

const formatTypeDisplay = income => {
  let display;
  if (income.income_type !== 'SALARY') {
    display = income.income_type;
  } else {
    display = `Salary - ${income.employer_name}`;
  }


  if (income.verified) {
    display = <span><CheckBox /> {display}</span>
  } else {
    display = <span><CheckBoxOutline /> {display}</span>
  }

  return display;
}

const headerColor = income => {
  if (income.income_type === 'SALARY' && income.verified) {
    return green500;
  } else if (income.income_type === 'SALARY' && !income.verified) {
    return green100;
  } else if (income.verified) {
    return blue500;
  } else {
    return blue100;
  }
}

const IncomeFormComponent = ({editable, handleSubmit, initialValues, pristine, submitting, valid, unverifyIncome, verifyIncome}) => {
  const onSubmit = () => {
    if (!initialValues.verified) {
      return verifyIncome;
    } else {
      return unverifyIncome;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit())}>
      <CardText>
        <Field name="stated_income" component={TextField} floatingLabelText="Stated Income" hintText="Stated Income" disabled={true} /><br />
        <Field name="verified_income" component={TextField} floatingLabelText="Verified Income" hintText="Verified Income" disabled={!editable} />
      </CardText>
      <CardActions style={{width: '100%', textAlign: 'right'}}>
        {!initialValues.verified && <RaisedButton type="submit" disabled={!editable || !valid || pristine || submitting} label="Verify" primary={true} />}
        {initialValues.verified && <RaisedButton type="submit" disabled={!editable || submitting} label="Unverify" secondary={true} />}
      </CardActions>
    </form>
  );
}

const IncomeForm = reduxForm({
  form: 'income',
  validate
})(IncomeFormComponent);

const IncomeCard = ({income, verifyIncome, unverifyIncome}) => {
  return (
  <Card style={{width: '30%'}}>
    <CardHeader title={formatTypeDisplay(income)} style={{backgroundColor: headerColor(income)}} />
    <IncomeForm initialValues={income} verifyIncome={verifyIncome} unverifyIncome={unverifyIncome}/>
  </Card>
  );
}

export default IncomeCard;
