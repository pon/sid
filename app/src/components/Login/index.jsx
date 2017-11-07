import React, {Component} from 'react';
import {connect} from 'react-redux';

import LoginForm from './LoginForm';
import {submitLogin, submitLoginSuccess} from '../../reducers/login';

export class Login extends Component {

  render () {
    return (
      <LoginForm {...this.props} />
    );
  }
}

const mapStateToProps = ({login}, ownProps) => {
  return {
    login,
    initialValues: {
      nextPath: ownProps.location && ownProps.location.state && ownProps.location.state.nextPathname
    }
  }
};

const mapDispatchToProps = dispatch => ({
  submitLogin: payload => {
    return dispatch(submitLogin(payload));
  },
  submitLoginSuccess: payload => {
    return dispatch(submitLoginSuccess(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
