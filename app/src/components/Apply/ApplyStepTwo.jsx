import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';
const {DOM: {select}} = React;

import RenderField from '../common/RenderField';

const validate = values => {
  const errors = {};

  return errors;
};

const ApplyStepTwoForm= props => {
  const {apply, handleSubmit, pristine, submitting, submitApplyStepTwo, valid} = props;
  const error = apply.get('error');

  const citizenshipOptions = [
    {id: 'US_CITIZEN', name: 'US Citizen'},
    {id: 'PERM_RESIDENT', name: 'Permanent Resident'},
    {id: 'NON_PERM_RESIDENT', name: 'Non-Permanent Resident'}
  ];

  const CheckboxLabel = styled.div`
    padding-top: 1.5em
  `;

  return (
    <form onSubmit={handleSubmit(submitApplyStepTwo)} className="pure-form pure-form-stacked">
      <fieldset>
        <div className="pure-g">
          <span>{error}</span>
          <h4 className="pure-u-1">Personal Information</h4>
          <div className="pure-u-1-2">
            <label>Date of Birth</label>
            <Field name="date_of_birth" component={RenderField} type="date" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-2">
            <label>Citizenship</label>
            <Field name="citizenship" component="select" className="pure-u-23-24">
              <option value="US_CITIZEN">US Citizen</option>
              <option value="PERM_RESIDENT">Permanent Resident</option>
              <option value="NON_PERM_RESIDENT">Non-Permanent Resident</option>
            </Field>
          </div>

          <h4 className="pure-u-1">Lease Information</h4>
          <div className="pure-u-1-2">
            <label>Address Street One</label>
            <Field name="street_one" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-2">
            <label>Address Street Two</label>
            <Field name="street_two" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-3">
            <label>City</label>
            <Field name="city" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-3">
            <label>State</label>
            <Field name="state" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-3">
            <label>Zip Code</label>
            <Field name="zip_code" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-2">
            <label>Security Deposit</label>
            <Field name="security_deposit" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-2">
            <label>Monthly Rent</label>
            <Field name="monthly_rent" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-3">
            <label>Lease Start Date</label>
            <Field name="start_date" component={RenderField} type="date" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-3">
            <label>Lease End Date</label>
            <Field name="end_date" component={RenderField} type="date" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-3">
            <label>Lease Length (Months)</label>
            <Field name="term_months" component={RenderField} type="number" className="pure-u-23-24"/>
          </div>

          <h4 className="pure-u-1">Employment Information</h4>
          <div className="pure-u-3-4">
            <label>Employer Name</label>
            <Field name="employer_name" component={RenderField} type="text" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1-4">
            <CheckboxLabel className="pure-checkbox">
              <Field name="is_self_employed" component="input" type="checkbox" /> Self Employed?
            </CheckboxLabel>
          </div>
          <div className="pure-u-1-3">
            <label>Status</label>
            <Field name="status" component="select" className="pure-u-23-24">
              <option value="CURRENT">Current</option>
              <option value="FUTURE">Future</option>
            </Field>
          </div>
          <div className="pure-u-1-3">
            <label>Start Month</label>
            <Field name="start_month" component="select" className="pure-u-23-24">
              <option></option>
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">Jun</option>
              <option value="7">Jul</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </Field>
          </div>
          <div className="pure-u-1-3">
            <label>Start Year</label>
            <Field name="start_year" component={RenderField} type="number" className="pure-u-23-24"/>
          </div>
          <div className="pure-u-1">
            <label>Gross Annual Income</label>
            <Field name="stated_income" component={RenderField} type="number" className="pure-u-1-3" />
          </div>
          <div className="pure-u-1">
            <button type="submit" disabled={!valid || pristine || submitting} className="pure-button pure-input-1-2 pure-button-primary pure-u-1">Submit</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default reduxForm({
  form: 'apply-step-two',
  validate
})(ApplyStepTwoForm);

