import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import {
  getApplicationInUnderwriting, 
  submitApproveApplication
} from '../../reducers/underwriting';

const UnderwritingApplicationWrapper = styled.div`
  width: 95%;
  margin: 0 auto;
  text-align: center;
`;

const UnderwritingActionWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin: 0 auto;
  height: 40px;
  margin-bottom: 5px;
`;

export class UnderwritingApplication extends Component {

  componentWillMount() {
    this.props.getApplicationInUnderwriting(this.props.applicationId);
  }

  render () {
    const application = this.props.underwriting.get('application');
    return (
      <UnderwritingApplicationWrapper>
        <h3>
          {application && application.status === 'UNDERWRITING' && 
          `Approve for $${application.lease.security_deposit} at 12% for ${application.lease.term_months} months?`
          }
          {application && application.status === 'APPROVED' &&
            'Application has already been approved!'
          }
        </h3>
        <br />
        <Divider />
        <br />
        <UnderwritingActionWrapper>
          {application && application.status === 'UNDERWRITING' && 
            <div>
              <RaisedButton
                style={{width: '49%', float: 'left'}}
                primary={true}
                label={'Approve'}
                onClick={() => {
                  return this.props.submitApproveApplication({
                    applicationId: this.props.applicationId,
                    interestRate: 1200,
                    amount: application.lease.security_deposit,
                    termMonths: application.lease.term_months
                  });
                }}
              />
              <RaisedButton
                style={{width: '49%', float: 'right'}}
                secondary={true}
                label={'Decline'}
              />
            </div>
          }
        </UnderwritingActionWrapper>
        <Snackbar
          open={!!this.props.underwriting.get('successMessage')}
          message={this.props.underwriting.get('successMessage') || ''}
          autoHideDuration={4000}
        />
      </UnderwritingApplicationWrapper>
    );
  }
}

const mapStateToProps = ({underwriting}, ownProps) => {
  return {
    underwriting,
    applicationId: ownProps.params.applicationId
  };
};

const mapDispatchToProps = dispatch => ({
  getApplicationInUnderwriting: applicationId => {
    return dispatch(getApplicationInUnderwriting(applicationId));
  },
  submitApproveApplication: payload => {
    return dispatch(submitApproveApplication(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UnderwritingApplication);
