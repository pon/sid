import React from 'react';
import {Field, reduxForm} from 'redux-form';
import styled from 'styled-components';
import {TextField} from 'redux-form-material-ui';

import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Snackbar from 'material-ui/Snackbar';

import {constants} from '../../utils/style-utils';

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@poplar.co$/i.test(values.email)) {
    errors.email = 'Invalid Email';
  }

  return errors;
};


const getVerificationStatus = user => {
  const now = new Date();
  if (user.verified) {
    return 'N/a';
  } else if (new Date(user.invitations[0].expires_at) > (new Date(now.getTime() + now.getTimezoneOffset() * 60000))) {
    return 'Valid';
  }

  return 'Expired';
}

const InviteFormComponent = props => {
  const {handleSubmit, pristine, submitting, sendInvite, valid} = props;
  return (
    <form onSubmit={handleSubmit(({email}) => sendInvite(email))}>
      <Field name="email" component={TextField} hintText="Email" floatingLabelText="Email" />
        <button type="submit" disabled={!valid || pristine || submitting}>Invite</button>
    </form>
  );
}

const InviteForm = reduxForm({
  form: 'invite',
  validate
})(InviteFormComponent);

const InviteTable = ({users, sendInvite, successMessage}) => {
  return (
    <div>
      <h3>Invitations</h3>
      <InviteForm sendInvite={sendInvite} />
      <Table selectable={false}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Email</TableHeaderColumn>
            <TableHeaderColumn>Verified?</TableHeaderColumn>
            <TableHeaderColumn># Invites</TableHeaderColumn>
            <TableHeaderColumn>Invite Status</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => {
            return (
              <TableRow key={user.id}>
                <TableRowColumn>{user.email}</TableRowColumn>
                <TableRowColumn>{user.verified ? 'Yes' : 'No'}</TableRowColumn>
                <TableRowColumn>{user.invitations.length}</TableRowColumn>
                <TableRowColumn>{getVerificationStatus(user)}</TableRowColumn>
                <TableRowColumn>{!user.verified &&
                  <div onClick={() => {sendInvite(user.email)}}>
                    <FlatButton label="Resend Invite" primary={true} />
                  </div>}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Snackbar
        open={!!successMessage}
        message={successMessage || ''}
        autoHideDuration={4000}
      />
    </div>
  );
}

export default InviteTable;
