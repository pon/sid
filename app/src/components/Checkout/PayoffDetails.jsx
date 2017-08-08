import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';

import FileUpload from '../common/FileUpload';

const PayoffDetailsForm = props => {
  const {handleSubmit, submitting, valid} = props;

  const PayoffDetailsWrapper = styled.div`
    width: 50%;
    margin: 0 auto;
    text-align: center;
  `;

  return (
    <PayoffDetailsWrapper>
      <form>
        <Field name="files" type="file" component={FileUpload} categoryOverride={'lease'} uploadMessage={'Upload Your Lease Here'}/>
        <RaisedButton fullWidth={true} label="Submit" primary={true} disabled={!valid || submitting} type="submit"/>
      </form>
    </PayoffDetailsWrapper>
  );
}

export default reduxForm({
  form: 'payoff-details'
})(PayoffDetailsForm);