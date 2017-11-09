import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {DatePicker, SelectField, TextField} from 'redux-form-material-ui';
import {grey100} from 'material-ui/styles/colors';

import IncomeForm from './IncomeForm';
import {constants} from '../../utils/style-utils';

const validate = values => {
  const errors = {};

  if (!values.street_one) {errors.street_one = 'Required';}
  if (!values.city) {errors.city = 'Required';}
  if (!values.state) {errors.state = 'Required';}

  if (!values.zip_code) {
    errors.zip_code = 'Required'
  } else if (!/^\d{5}(?:[-\s]\d{4})?$/.test(values.zip_code)) {
    errors.zip_code = 'Invalid Zip Code';
  }

  if (!values.security_deposit) {
    errors.security_deposit = 'Required';
  } else if (!Number.isInteger(parseInt(values.security_deposit, 10))) {
    errors.security_deposit = 'Invalid Amount';
  }

  if (!values.monthly_rent) {
    errors.monthly_rent = 'Required';
  } else if (!Number.isInteger(parseInt(values.monthly_rent, 10))) {
    errors.monthly_rent = 'Invalid Amount';
  }

  if (!values.incomes || !values.incomes.length) {
    errors.incomes = 'You must provide at least one income.';
  }

  if (!values.years_of_employment) {
    errors.years_of_employment = 'Required';
  } else if (!Number.isInteger(parseInt(values.years_of_employment, 10))) {
    errors.years_of_employment = 'Invalid Years of Employment';
  }

  return errors;
};

let ApplyApplicationStepForm= props => {
  const {apply, handleSubmit, pristine, submitting, submitApplyApplicationStep, valid} = props;

  const error = apply.get('error');

  const wrapperStyles = {width: '75%', margin: '0 auto', marginBottom: '1em'};

  const FormError = styled.div`
    padding-top: 5px;
    padding-bottom: 5px;
    color: ${constants.red}
  `;

  return (
    <div style={wrapperStyles}>
      <form onSubmit={handleSubmit(submitApplyApplicationStep)}>
        <FormError>{error}</FormError>
        <Card>
          <CardHeader title={<h5>Current Address</h5>} style={{backgroundColor: grey100}}/>
          <CardText>
            <Field name="street_one" fullWidth={true} component={TextField} type="text" hintText="Address Line One" />
            <Field name="street_two" fullWidth={true} component={TextField} type="text" hintText="Address Line Two" />
            <Field name="city" fullWidth={true} component={TextField} type="text" hintText="City" />
            <Field name="state" fullWidth={true} component={SelectField} hintText="State">
              <MenuItem value="AL" primaryText="Alabama" />
              <MenuItem value="AK" primaryText="Alaska" />
              <MenuItem value="AS" primaryText="American Samoa" />
              <MenuItem value="AZ" primaryText="Arizona" />
              <MenuItem value="AR" primaryText="Arkansas" />
              <MenuItem value="AA" primaryText="Armed Forces Americas (except Canada)" />
              <MenuItem value="AE" primaryText="Armed Forces Europe, the Middle East, and Canada" />
              <MenuItem value="AP" primaryText="Armed Forces Pacific" />
              <MenuItem value="CA" primaryText="California" />
              <MenuItem value="CO" primaryText="Colorado" />
              <MenuItem value="CT" primaryText="Connecticut" />
              <MenuItem value="DE" primaryText="Delaware" />
              <MenuItem value="DC" primaryText="District of Columbia" />
              <MenuItem value="FM" primaryText="Federated States of Micronesia" />
              <MenuItem value="FL" primaryText="Florida" />
              <MenuItem value="GA" primaryText="Georgia" />
              <MenuItem value="GU" primaryText="Guam" />
              <MenuItem value="HI" primaryText="Hawaii" />
              <MenuItem value="ID" primaryText="Idaho" />
              <MenuItem value="IL" primaryText="Illinois" />
              <MenuItem value="IN" primaryText="Indiana" />
              <MenuItem value="IA" primaryText="Iowa" />
              <MenuItem value="KS" primaryText="Kansas" />
              <MenuItem value="KY" primaryText="Kentucky" />
              <MenuItem value="LA" primaryText="Louisiana" />
              <MenuItem value="ME" primaryText="Maine" />
              <MenuItem value="MH" primaryText="Marshall Islands" />
              <MenuItem value="MD" primaryText="Maryland" />
              <MenuItem value="MA" primaryText="Massachusetts" />
              <MenuItem value="MI" primaryText="Michigan" />
              <MenuItem value="MN" primaryText="Minnesota" />
              <MenuItem value="MS" primaryText="Mississippi" />
              <MenuItem value="MO" primaryText="Missouri" />
              <MenuItem value="MT" primaryText="Montana" />
              <MenuItem value="NE" primaryText="Nebraska" />
              <MenuItem value="NV" primaryText="Nevada" />
              <MenuItem value="NH" primaryText="New Hampshire" />
              <MenuItem value="NJ" primaryText="New Jersey" />
              <MenuItem value="NM" primaryText="New Mexico" />
              <MenuItem value="NY" primaryText="New York" />
              <MenuItem value="NC" primaryText="North Carolina" />
              <MenuItem value="ND" primaryText="North Dakota" />
              <MenuItem value="MP" primaryText="Northern Mariana Islands" />
              <MenuItem value="OH" primaryText="Ohio" />
              <MenuItem value="OK" primaryText="Oklahoma" />
              <MenuItem value="OR" primaryText="Oregon" />
              <MenuItem value="PW" primaryText="Palau" />
              <MenuItem value="PA" primaryText="Pennsylvania" />
              <MenuItem value="PR" primaryText="Puerto Rico" />
              <MenuItem value="RI" primaryText="Rhode Island" />
              <MenuItem value="SC" primaryText="South Carolina" />
              <MenuItem value="SD" primaryText="South Dakota" />
              <MenuItem value="TN" primaryText="Tennessee" />
              <MenuItem value="TX" primaryText="Texas" />
              <MenuItem value="UT" primaryText="Utah" />
              <MenuItem value="VT" primaryText="Vermont" />
              <MenuItem value="VA" primaryText="Virginia" />
              <MenuItem value="VI" primaryText="Virgin Islands" />
              <MenuItem value="WA" primaryText="Washington" />
              <MenuItem value="WV" primaryText="West Virginia" />
              <MenuItem value="WI" primaryText="Wisconsin" />
              <MenuItem value="WY" primaryText="Wyoming" />
            </Field>
            <Field name="zip_code" fullWidth={true} component={TextField} type="text" hintText="Zip Code" /> 
          </CardText>
        </Card>
        <br />
        <Card>
          <CardHeader title={<h5>New Lease Details</h5>} style={{backgroundColor: grey100}} />
          <CardText>
            <Field name="security_deposit" style={{width: '49%', float: 'left'}} component={TextField} type="number" hintText="Security Deposit" floatingLabelText="Security Deposit"/>
            <Field name="monthly_rent" style={{width: '49%', float: 'right'}} component={TextField} type="number" hintText="Monthly Rent" floatingLabelText="Monthly Rent"/>
            <Field name="start_date" fullWidth={true} component={DatePicker} format={null} hintText="When does your lease start?" />
            <Field name="term_months" fullWidth={true} component={TextField} type="number" hintText="How many months is your lease?" />
          </CardText>
        </Card>
        <br />
        <Card>
          <CardHeader title={<h5>Income &amp; Employment</h5>} style={{backgroundColor: grey100}} />
          <CardText>
            <Field name="incomes" component={IncomeForm} />
            <Field name="years_of_employment" fullWidth={true} component={TextField} type="number" hintText="Total Years of Employment" />
        </CardText>
        <CardActions style={{width: '100%', textAlign: 'center', backgroundColor: grey100}}>
          <RaisedButton style={{width: '50%'}} label="Submit" primary={true} disabled={!valid || pristine || submitting} type="submit"/>
        </CardActions>
      </Card>
      </form>
    </div>
  );
}

ApplyApplicationStepForm = reduxForm({
  form: 'apply-application-step',
  validate
})(ApplyApplicationStepForm);

ApplyApplicationStepForm = connect(
  ({apply}) => {
    return {
      initialValues: apply.get('submittedValues')
    };
  }
)(ApplyApplicationStepForm);

export default ApplyApplicationStepForm;
