import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import {
  getApplicationForVerification, 
  reverifyApplication,
  unverifyCitizenship,
  unverifyIdentity,
  unverifyIncome, 
  verifyApplication,
  verifyCitizenship,
  verifyIdentity,
  verifyIncome
} from '../../reducers/verification';

import FinancialSection from './FinancialSection';
import IncomeSection from './IncomeSection';
import LeaseSection from './LeaseSection';
import ProfileSection from './ProfileSection';
import UploadBar from '../Uploads/UploadBar';

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
          <UploadBar 
            style={{float: 'right', width: '25%'}} 
            uploads={(application && application.uploads) || []} 
          />
          {application && application.incomes && application.incomes.length &&
            <IncomeSection 
              style={{float: 'left', width: '70%'}}
              incomes={application.incomes} 
              editable={!verified}
              verifyIncome={this.props.verifyIncome} 
              unverifyIncome={this.props.unverifyIncome}
            />
          }
          {application && application.profile &&
            <ProfileSection 
              style={{float: 'left', width: '33%', marginTop: '20px'}}
              profile={application.profile}
              unverifyCitizenship={this.props.unverifyCitizenship}
              unverifyIdentity={this.props.unverifyIdentity}
              verifyCitizenship={this.props.verifyCitizenship}
              verifyIdentity={this.props.verifyIdentity}
            />
          }
          {application && application.lease &&
            <LeaseSection
              style={{float: 'left', width: '33%', marginTop: '20px', marginLeft: '4%'}}
              lease={application.lease}
            />
          }
          {application && application.financial_credentials &&
            <FinancialSection 
              style={{float: 'left', width: '70%', marginTop: '20px'}}
              financialCredentials={application.financial_credentials}
            />  
          }
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
  unverifyCitizenship: userId => {
    return dispatch(unverifyCitizenship(userId));
  },
  unverifyIdentity: userId => {
    return dispatch(unverifyIdentity(userId));
  },
  unverifyIncome: income => {
    return dispatch(unverifyIncome(income.id));
  },
  verifyCitizenship: userId => {
    return dispatch(verifyCitizenship(userId));
  },
  verifyIdentity: userId => {
    return dispatch(verifyIdentity(userId));
  },
  verifyIncome: income => {
    return dispatch(verifyIncome(income));
  },
  verifyApplication: applicationId => {
    return dispatch(verifyApplication(applicationId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationApplication);
