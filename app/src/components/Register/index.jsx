import React from 'react';
import {connect} from 'react-redux';

import RegisterForm from './RegisterForm';
import {submitRegister} from '../../reducers/register';

const Register = props => {
  return (
    <RegisterForm register={props.register} submitRegister={props.submitRegister}/>
  );
}

const mapStateToProps = ({register}) => ({
  register
});

const mapDispatchToProps = (dispatch) => ({
  submitRegister: payload => {
    return dispatch(submitRegister(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);