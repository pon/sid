import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import AcceptInviteForm from './AcceptInviteForm';
import {submitAcceptInvitation, submitCheckInviteStatus} from '../../reducers/acceptInvite'; 

const AcceptInviteWrapper = styled.div`
  width: 25%;
  margin: 0 auto;
  text-align: center;
`;

export class AcceptInvite extends Component {

  componentWillMount() {
    return this.props.submitCheckInviteStatus({
      token: this.props.token
    })
  }

  render() {
    return (
      <AcceptInviteWrapper>
        {this.props.acceptInvite.get('inviteStatus') === 'ACCEPTED' && 
          <div>
            <h3>Invitation Already Accepted!</h3>
            <Link to="/login">
              <FlatButton label="Login Now" primary={true} />
            </Link>
          </div>
        }
        {this.props.acceptInvite.get('inviteStatus') === 'INVALID' &&
          <div>
            <h4>Invalid Invite Token - Please reach out to your admin</h4>
          </div>
        }
        {this.props.acceptInvite.get('inviteStatus') === 'EXPIRED' &&
          <div>
            <h4>Expired Invite Token - Please reach out to your admin to generate a new token.</h4>
          </div>
        }
        {this.props.acceptInvite.get('inviteStatus') === 'VALID' && <AcceptInviteForm {...this.props} />}
      </AcceptInviteWrapper>
    );
  }
}

const mapStateToProps = ({acceptInvite}, ownProps) => {
  return {
    acceptInvite,
    token: ownProps.params.token,
    initialValues: {
      token: ownProps.params.token
    }
  };
};

const mapDispatchToProps = dispatch => ({
  submitAcceptInvitation: payload => {
    return dispatch(submitAcceptInvitation(payload));
  },
  submitCheckInviteStatus: payload => {
    return dispatch(submitCheckInviteStatus(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AcceptInvite);