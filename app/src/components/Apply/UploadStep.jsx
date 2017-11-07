import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';

import FileUpload from '../common/FileUpload';

const ApplyUploadStepForm = props => {
  const {handleSubmit, submitting, submitApplyUploadStep, valid} = props;

  const wrapperStyles = {width: '60%', margin: '0 auto', marginBottom: '1em'};

  return (
    <div style={wrapperStyles}>
      <form onSubmit={handleSubmit(submitApplyUploadStep)}>
        <h4>Document Upload</h4>

        <Field name="files" type="file" component={FileUpload} />

        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-upload-step'
})(ApplyUploadStepForm);
