import React from 'react';
import {connect} from 'react-redux';

import ApplyStepOneForm from './ApplyStepOne';
import {submitApplyStepOne} from '../../reducers/apply';

const Apply = props => {
  return (
    <div>
      <h1>Apply</h1>
      <ApplyStepOneForm apply={props.apply} submitApplyStepOne={props.submitApplyStepOne}/>
     </div>
  )
}

const mapStateToProps = ({apply}) => ({
  apply
})

const mapDispatchToProps = (dispatch) => ({
  submitApplyStepOne: payload => {
    return dispatch(submitApplyStepOne(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Apply);