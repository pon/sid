import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import styled from 'styled-components';

import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {getApplicationsInVerification} from '../../reducers/verification';

const VerificationDashboardWrapper = styled.div`
  width: 95%;
  margin: 0 auto;
`;

export class VerificationDashboard extends Component {

  componentWillMount() {
    this.props.getApplicationsInVerification();
  }

  render () {
    const applications = this.props.verification.get('applications');
    return (
      <VerificationDashboardWrapper>
        {applications && <Table selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => {
              return (
                <TableRow key={application.id}>
                  <TableRowColumn>{application.id}</TableRowColumn>
                  <TableRowColumn><Link to={`/verification/${application.id}`}><FlatButton label="View Application" primary={true}/></Link></TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>}
      </VerificationDashboardWrapper>
    );
  }
}

const mapStateToProps = ({verification}) => {
  return {
    verification
  };
};

const mapDispatchToProps = dispatch => ({
  getApplicationsInVerification: () => {
    return dispatch(getApplicationsInVerification());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationDashboard);
