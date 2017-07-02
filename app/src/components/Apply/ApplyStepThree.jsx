import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';
import RaisedButton from 'material-ui/RaisedButton';

import FileUpload from '../common/FileUpload';

const validate = values => {
  console.log(values);
  const errors = {};

  return errors;
};

const ApplyStepThreeForm = props => {
  const {apply, handleSubmit, submitting, submitApplyStepThree, valid} = props;
  const error = apply.get('error');

  const wrapperStyles = {width: '60%', margin: '0 auto', 'margin-bottom': '1em'};

  return (
    <div style={wrapperStyles}>
      <form onSubmit={handleSubmit(submitApplyStepThree)}>
        <h4>Document Upload</h4>

        <Field name="file" component="input" type="hidden" />
        <FileUpload />

        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-step-three',
  validate
})(ApplyStepThreeForm);


