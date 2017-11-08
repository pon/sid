import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {grey100} from 'material-ui/styles/colors';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import {TextField} from 'redux-form-material-ui';

import Faq from './Faq';

const validate = values => {
  const errors = {};

  return errors;
};

const ApplyConfirmStepForm = props => {
  const {handleSubmit, submitting, submitApplyConfirmStep, valid} = props;

  const wrapperStyles = {width: '75%', margin: '0 auto', marginBottom: '1em'};

  return (
    <div style={wrapperStyles}>
      <Faq
        header={<span>What am I agreeing to?</span>}
        body={<span>By entering your Social Security Number and clicking "Submit Application" you are agreeing to allow Poplar to pull your credit report. This inquiry will appear on your credit history. You are also acknowledging that you have read and understood our <a href="https://www.poplar.co/privacy-policy/">Privacy Policy</a> and <a href="https://www.poplar.co/terms-of-service/">Terms of Service</a>.</span>}
      />
      <br />
      <Card>
        <CardHeader title="Consent to Credit Inquiry" style={{backgroundColor: grey100}}/>
        <CardText>
          <form onSubmit={handleSubmit(submitApplyConfirmStep)}>
            <Field name="social_security_number" fullWidth={true} component={TextField} type="text" hintText="Social Security Number"/>

            <RaisedButton fullWidth={true} label="Submit Application" primary={true} disabled={!valid || submitting} type="submit"/>
          </form>
        </CardText>
      </Card>
    </div>
  );
}

export default reduxForm({
  form: 'apply-confirm-step',
  validate
})(ApplyConfirmStepForm);


