import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import {
  getApplicationForVerification, 
  reverifyApplication,
  unverifyIncome, 
  verifyApplication,
  verifyIncome
} from '../../reducers/verification';

import UploadBar from '../Uploads/UploadBar';
import IncomeSection from './IncomeSection';

const VerificationApplicationWrapper = styled.div`
  width: 95%;
  margin: 0 auto;
`;

const VerificationActionWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin: 0 auto;
  height: 40px;
  margin-bottom: 5px;
`;

export class VerificationApplication extends Component {

  componentWillMount() {
    this.props.getApplicationForVerification(this.props.applicationId);
  }

  render () {
    const application = this.props.verification.get('application');
    const verified = (application && application.status === 'UNDERWRITING');
    return (
      <VerificationApplicationWrapper>
        <VerificationActionWrapper>
          <RaisedButton 
            style={{width: '50%'}}
            primary={!verified}
            secondary={verified}
            label={verified ? 'Undo Verification' : 'Complete Verification'}
            onClick={() => {
              if (!verified) {
                return this.props.verifyApplication(this.props.applicationId);
              } else {
                 return this.props.reverifyApplication(this.props.applicationId);
              }
            }}/>
        </VerificationActionWrapper>
        <Divider />
        <div>
          {application && application.incomes && application.incomes.length &&
            <IncomeSection 
              style={{float: 'left', width: '70%'}}
              incomes={application.incomes} 
              editable={!verified}
              verifyIncome={this.props.verifyIncome} 
              unverifyIncome={this.props.unverifyIncome}
            />
          }
          <UploadBar 
            style={{float: 'right', width: '25%'}} 
            uploads={(application && application.uploads) || []} 
          />
        </div>
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
  reverifyApplication: applicationId => {
    return dispatch(reverifyApplication(applicationId));
  },
  unverifyIncome: income => {
    return dispatch(unverifyIncome(income.id));
  },
  verifyIncome: income => {
    return dispatch(verifyIncome(income));
  },
  verifyApplication: applicationId => {
    return dispatch(verifyApplication(applicationId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationApplication);
