import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';

import RenderField from '../common/RenderField';

const validate = values => {
  const errors = {};

  if (!values.credit_check_consent) {
    errors.credit_check_consent = 'You must consent to credit check';
  }

  return errors;
};

const ApplyStepThreeForm = props => {
  const {apply, handleSubmit, pristine, submitting, submitApplyStepThree, valid} = props;
  const error = apply.get('error');
  const profile = apply.get('profile');
  const application = apply.get('application');

  return (
    <div>
      <span>{error}</span>
      <form onSubmit={handleSubmit(submitApplyStepThree)}>
        <h4>Confirm</h4>

        <h5>Personal</h5>
        <ul>
          <li>Name - {profile.first_name} {profile.last_name}</li>
          <li>Date of Birth - {profile.date_of_birth}</li>
          <li>Citizenship - {profile.citizenship}</li>
        </ul>
        
        <h5>Lease &amp; Address</h5>
        <ul>
          <li>Address Line One - {application.lease.address.street_one}</li>
          <li>Address Line Two - {application.lease.address.street_two}</li>
          <li>Address City - {application.lease.address.city}</li>
          <li>Address State - {application.lease.address.state_id}</li>
          <li>Address Zip Code - {application.lease.address.zip_code}</li>

          <li>Security Deposit - {application.lease.security_deposit}</li>
          <li>Monthly Rent - {application.lease.monthly_rent}</li>
          <li>Start Date - {application.lease.start_date}</li>
          <li>End Date - {application.lease.end_date}</li>
          <li>Term Months - {application.lease.term_months}</li>
        </ul>

        <h5>Employment</h5>
        <ul>
          <li>Employer Name - {application.employment.employer_name}</li>
          <li>Status - {application.employment.status}</li>
          <li>Start Month - {application.employment.start_month}</li>
          <li>Start Year - {application.employment.start_year}</li>
          <li>Income - {application.employment.stated_income}</li>
        </ul>

        <div>
          <label>Credit Check Consent?</label>
          <div>
            <Field name="credit_check_consent" component={RenderField} type="checkbox" />
          </div>
        </div>

        <div>
          <button type="submit" disabled={!valid || pristine || submitting}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-step-three',
  validate
})(ApplyStepThreeForm);


