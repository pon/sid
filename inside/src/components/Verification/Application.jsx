import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Snackbar from 'material-ui/Snackbar';

import {getApplicationForVerification, unverifyIncome, verifyIncome} from '../../reducers/verification';

import IncomeSection from './IncomeSection';

const VerificationApplicationWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
`;

export class VerificationApplication extends Component {

  componentWillMount() {
    this.props.getApplicationForVerification(this.props.applicationId);
  }

  render () {
    const application = this.props.verification.get('application');
    return (
      <VerificationApplicationWrapper>
        {application && application.incomes && application.incomes.length &&
          <IncomeSection incomes={application.incomes} verifyIncome={this.props.verifyIncome} unverifyIncome={this.props.unverifyIncome}/>
        }
        <Snackbar
          open={!!this.props.verification.get('successMessage')}
          message={this.props.verification.get('successMessage') || ''}
          autoHideDuration={4000}
        />
      </VerificationApplicationWrapper>
    );
  }
}

const mapStateToProps = ({verification}, ownProps) => {
  return {
    verification,
    applicationId: ownProps.params.applicationId
  };
};

const mapDispatchToProps = dispatch => ({
  getApplicationForVerification: applicationId => {
    return dispatch(getApplicationForVerification(applicationId));
  },
  unverifyIncome: income => {
    return dispatch(unverifyIncome(income.id));
  },
  verifyIncome: income => {
    return dispatch(verifyIncome(income));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationApplication);
