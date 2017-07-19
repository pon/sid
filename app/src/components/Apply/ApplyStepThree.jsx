import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';

import FileUpload from '../common/FileUpload';

const validate = values => {
  const errors = {};

  return errors;
};

const ApplyStepThreeForm = props => {
  const {handleSubmit, submitting, submitApplyStepThree, valid} = props;

  const wrapperStyles = {width: '60%', margin: '0 auto', marginBottom: '1em'};

  return (
    <div style={wrapperStyles}>
      <form onSubmit={handleSubmit(submitApplyStepThree)}>
        <h4>Document Upload</h4>

        <Field name="files" type="file" component={FileUpload} />

        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-step-three',
  validate
})(ApplyStepThreeForm);


