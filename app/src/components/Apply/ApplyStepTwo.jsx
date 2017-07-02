import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {DatePicker, SelectField, TextField} from 'redux-form-material-ui';

import {constants} from '../../utils/style-utils';
import StyledInput from '../common/StyledInput';

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

  return errors;
};

let ApplyStepTwoForm= props => {
  const {apply, handleSubmit, pristine, submitting, submitApplyStepTwo, valid} = props;
  const error = apply.get('error');

  const wrapperStyles = {width: '60%', margin: '0 auto', 'margin-bottom': '1em'};

  const CheckboxLabel = styled.div`
    padding-top: 1.5em
  `;

  const FormError = styled.div`
    padding-top: 5px;
    padding-bottom: 5px;
    color: ${constants.red}
  `;

  return (
    <div style={wrapperStyles}>
      <form onSubmit={handleSubmit(submitApplyStepTwo)}>
        <h3>Current Address</h3>
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

        <h3>New Lease Details</h3>
        <Field name="security_deposit" style={{width: '49%', float: 'left'}} component={TextField} type="number" hintText="Security Deposit" floatingLabelText="Security Deposit"/>
        <Field name="monthly_rent" style={{width: '49%', float: 'right'}} component={TextField} type="number" hintText="Monthly Rent" floatingLabelText="Monthly Rent"/>
        <Field name="start_date" fullWidth={true} component={DatePicker} format={null} hintText="When does your lease start?" />
        <Field name="term_months" fullWidth={true} component={TextField} type="number" hintText="How many months is your lease?" />

        <h3>Employment</h3>
        <Field name="employer_name" fullWidth={true} component={TextField} hintText="Employer Name" />
        <Field name="status" fullWidth={true} component={SelectField} hintText="Status">
          <MenuItem value="CURRENT" primaryText="Current" />
          <MenuItem value="FUTURE" primaryText="Future" />
        </Field>
        <Field name="stated_income" style={{width: '49%', float: 'left'}} fullWidth={true} component={TextField} type="number" hintText="Annual Income" floatingLabelText="Annual Income"/>
        <Field name="years_of_employment" style={{width: '49%', float: 'right'}} fullWidth={true} component={TextField} type="number" hintText="Total Years of Employment" floatingLabelText="Total Years of Employment" />

        <div style={{'text-align': 'center'}}>
          <RaisedButton label="Submit" primary={true} disabled={!valid || pristine || submitting} type="submit"/>
        </div>

        {/*<FormError>{error}</FormError>

        <h3>Personal Info</h3>
        <fieldset className="pure-g">
          <div className="pure-u-1">
            <label>Date of Birth</label>
            <Field name="date_of_birth" component={StyledInput} type="date" className="pure-u-1" />
          </div>
          <div className="pure-u-1">
            <label>Citizenship</label>
            <Field name="citizenship" component="select" className="pure-u-1">
              <option value="US_CITIZEN">US Citizen</option>
              <option value="PERM_RESIDENT">Permanent Resident</option>
              <option value="NON_PERM_RESIDENT">Non-Permanent Resident</option>
            </Field>
          </div>
        </fieldset>

        <button type="submit" disabled={!valid || pristine || submitting} className="pure-button pure-input-1 pure-button-primary pure-u-1">Submit</button>*/}
      </form>
    </div>
  );
}

ApplyStepTwoForm = reduxForm({
  form: 'apply-step-two',
  validate
})(ApplyStepTwoForm);

ApplyStepTwoForm = connect(
  ({apply}) => {
    return {
      initialValues: apply.get('submittedValues')
    };
  }
)(ApplyStepTwoForm);

export default ApplyStepTwoForm;