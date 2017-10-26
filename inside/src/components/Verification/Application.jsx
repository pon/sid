import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Snackbar from 'material-ui/Snackbar';

import {getApplicationForVerification, unverifyIncome, verifyIncome} from '../../reducers/verification';

import UploadBar from '../Uploads/UploadBar';
import IncomeSection from './IncomeSection';

const VerificationApplicationWrapper = styled.div`
  width: 95%;
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
          <IncomeSection 
            style={{float: 'left', width: '70%'}}
            incomes={application.incomes} 
            verifyIncome={this.props.verifyIncome} 
            unverifyIncome={this.props.unverifyIncome}
          />
        }
        <UploadBar 
          style={{float: 'right', width: '25%'}} 
          uploads={(application && application.uploads) || []} 
        />
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
