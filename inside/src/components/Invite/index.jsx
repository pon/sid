import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import InviteTable from './InviteTable';

import {getInvitedUsers, sendInvite} from '../../reducers/invite';

const InviteWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
  text-align: center;
`;

export class Invite extends Component {

  componentWillMount() {
    return this.props.getInvitedUsers();
  }

  render () {
    return (
      <InviteWrapper>
        {this.props.invite.get('users').length && 
          <InviteTable 
            users={this.props.invite.get('users')} 
            sendInvite={this.props.sendInvite} 
            successMessage={this.props.invite.get('successMessage')} />}
      </InviteWrapper>
    );
  }
}

const mapStateToProps = ({invite}) => {
  return {
    invite
  }
};

const mapDispatchToProps = dispatch => ({
  getInvitedUsers: () => {
    return dispatch(getInvitedUsers());
  },
  sendInvite: email => {
    return dispatch(sendInvite({email}))
    .then(() => dispatch(getInvitedUsers()));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Invite);