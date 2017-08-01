import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import AdditionalUploadForm from './AdditionalUploadForm';
import {submitAdditionalUpload} from '../../reducers/additionalUpload';

export class AdditionalUpload extends Component {
  
  render() {
    const AdditionalUploadWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    return (
      <AdditionalUploadWrapper>
        <AdditionalUploadForm {...this.props} />
      </AdditionalUploadWrapper>
    );
  }
}

const initialValues = {};
const mapStateToProps = ({additionalUpload}, ownProps) => {
  initialValues.application_id = ownProps.params.application_id;
  return {
    additionalUpload,
    initialValues
  }
};

const mapDispatchToProps = dispatch => ({
  submitAdditionalUpload: payload => {
    return dispatch(submitAdditionalUpload(payload))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalUpload);