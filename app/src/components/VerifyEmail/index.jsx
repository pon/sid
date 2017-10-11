import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import VerifyEmailForm from './VerifyEmailForm';
import {submitEmailVerification, submitResendEmailVerification} from '../../reducers/verifyEmail';

export class VerifyEmail extends Component {

  componentWillMount() {
    return this.props.submitEmailVerification({
      token: this.props.token
    });
  }

  render () {

    const VerifyEmailWrapper = styled.div`
      width: 50%;
      margin: 0 auto;
      text-align: center;
    `;

    return (
      <VerifyEmailWrapper>
        {this.props.verifyEmail.get('error') && <VerifyEmailForm {... this.props} />}
        {this.props.verifyEmail.get('successMessage') && 
          <div>
            <h3>{this.props.verifyEmail.get('successMessage')}</h3>
            <Link to="/dashboard">
              <FlatButton label="Return to Dashboard" primary={true} />
            </Link>
          </div>
        }
      </VerifyEmailWrapper>
    );
  }
}

const mapStateToProps = ({verifyEmail}, ownProps) => {
  return {
    verifyEmail,
    token: ownProps.params.token
  };
};

const mapDispatchToProps = dispatch => ({
  submitEmailVerification: payload => {
    return dispatch(submitEmailVerification(payload));
  },
  submitResendEmailVerification: () => {
    return dispatch(submitResendEmailVerification());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
