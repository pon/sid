import React, {Component} from 'react';
import {connect} from 'react-redux';

import ResetPasswordForm from './ResetPasswordForm';
import {submitResetPassword} from '../../reducers/resetPassword';

export class ResetPassword extends Component {
  render () {
    if (!this.props.resetPassword.get('successMessage')) {
      return (
        <ResetPasswordForm {...this.props} />
      );
    }
    
    return (
      <h3>{this.props.resetPassword.get('successMessage')}</h3>
    );
  }
}

const mapStateToProps = ({resetPassword}, ownProps) => {
  return {
    resetPassword,
    initialValues: {
      token: ownProps.params.token
    }
  };
};

const mapDispatchToProps = dispatch => ({
  submitResetPassword: payload => {
    return dispatch(submitResetPassword(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
