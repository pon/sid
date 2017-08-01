import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';

import FileUpload from '../common/FileUpload';

const AdditionalUploadForm = props => {
  const {handleSubmit, submitting, submitAdditionalUpload, valid} = props;

  const wrapperStyles = {width: '60%', margin: '0 auto', marginBottom: '1em'};
  
  return (
    <div style={wrapperStyles}>
      <h2>Upload Additional Files</h2>
      <form onSubmit={handleSubmit(submitAdditionalUpload)}>
        <Field name="files" type="file" component={FileUpload} /> 

        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'additional-upload'
})(AdditionalUploadForm);