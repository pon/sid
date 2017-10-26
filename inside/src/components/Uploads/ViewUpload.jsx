import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {getUpload} from '../../reducers/uploads';

const UploadsWrapper = styled.div`
  width: 95%;
  margin: 0 auto;
`;

export class ViewUpload extends Component {

  componentWillMount() {
    this.props.getUpload(this.props.uploadId);
  }

  render () {
    return (
      <UploadsWrapper>
        <img src={this.props.uploads.get('upload')} />
      </UploadsWrapper>
    );
  }
}

const mapStateToProps = ({uploads}, ownProps) => {
  return {
    uploads,
    uploadId: ownProps.params.uploadId
  }
};

const mapDispatchToProps = dispatch => ({
  getUpload: uploadId => {
    return dispatch(getUpload(uploadId));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewUpload);