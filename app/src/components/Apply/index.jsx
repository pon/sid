import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import ApplyStepOneForm from './ApplyStepOne';
import ApplyStepTwoForm from './ApplyStepTwo';
import ApplyStepThreeForm from './ApplyStepThree';
import {getApply, submitApplyStepOne, submitApplyStepTwo, submitApplyStepThree} from '../../reducers/apply';

export class Apply extends Component {

  componentWillMount() {
    return this.props.getApply();
  }

  render () {
    let applyStep;

    const application = this.props.apply.get('application');

    // if (!this.props.apply.get('profile')) {
    //   applyStep = <ApplyStepOneForm apply={this.props.apply} submitApplyStepOne={this.props.submitApplyStepOne}/>;
    // } else if (application && (!application.employment || !application.lease)) {
    //   applyStep = <ApplyStepTwoForm apply={this.props.apply} submitApplyStepTwo={this.props.submitApplyStepTwo}/>;
    // } else {
    //   applyStep = <ApplyStepThreeForm apply={this.props.apply} submitApplyStepThree={this.props.submitApplyStepThree}/>;
    // }

    applyStep = <ApplyStepThreeForm apply={this.props.apply} submitApplyStepThree={this.props.submitApplyStepThree}/>;


    const ApplyWrapper = styled.div`
      padding-left: 25%;
      padding-right: 25%;
    `;

    return (
      <ApplyWrapper>
        {applyStep}
      </ApplyWrapper>
    )
  }
}

const mapStateToProps = ({apply}) => ({
  apply
})

const mapDispatchToProps = (dispatch) => ({
  getApply: () => {
    return dispatch(getApply());
  },
  submitApplyStepOne: payload => {
    return dispatch(submitApplyStepOne(payload));
  },
  submitApplyStepTwo: payload => {
    return dispatch(submitApplyStepTwo(payload));
  },
  submitApplyStepThree: payload => {
    return dispatch(submitApplyStepThree(payload));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Apply);