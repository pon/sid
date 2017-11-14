import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';

import Faq from '../common/Faq';
import FileUpload from '../common/FileUpload';

const ApplyUploadStepForm = props => {
  const {handleSubmit, submitting, submitApplyUploadStep, valid} = props;

  const wrapperStyles = {width: '75%', margin: '0 auto', marginBottom: '1em'};

  return (
    <div style={wrapperStyles}>
      <Faq
        header={<span>What should I upload?</span>}
        body={<span>Please upload a color scan or photo of your ID. If you did not connect your primary checking account on the previous page please upload copies of your previous 3 paystubs.</span>
}
      />
      <form onSubmit={handleSubmit(submitApplyUploadStep)}>
        <Field name="files" type="file" component={FileUpload} />
        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'apply-upload-step'
})(ApplyUploadStepForm);
