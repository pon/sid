import React, {Component} from 'react';
import {connect} from 'react-redux';

import ForgotPasswordForm from './ForgotPasswordForm';
import {submitForgotPassword} from '../../reducers/forgotPassword';

export class ForgotPassword extends Component {
  render () {
    if (!this.props.forgotPassword.get('successMessage')) {
      return (
        <ForgotPasswordForm forgotPassword={this.props.forgotPassword} submitForgotPassword={this.props.submitForgotPassword}/>
      );
    }
    
    return (
      <h3>{this.props.forgotPassword.get('successMessage')}</h3>
    );
  }
}

const mapStateToProps = ({forgotPassword}) => ({
  forgotPassword
});

const mapDispatchToProps = dispatch => ({
  submitForgotPassword: payload => {
    return dispatch(submitForgotPassword(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);