import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import styled from 'styled-components';
import moment from 'moment';

import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {getApplicationsInUnderwriting} from '../../reducers/underwriting';

const UnderwritingDashboardWrapper = styled.div`
  width: 95%;
  margin: 0 auto;
`;

export class UnderwritingDashboard extends Component {

  componentWillMount() {
    this.props.getApplicationsInUnderwriting();
  }

  render () {
    const applications = this.props.underwriting.get('applications');
    return (
      <UnderwritingDashboardWrapper>
        {applications && <Table selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Completed Verification At</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => {
              return (
                <TableRow key={application.id}>
                  <TableRowColumn>{application.id}</TableRowColumn>
                  <TableRowColumn>{moment(application.completed_verification_at).format('ddd MMMM Do YYYY, h:mm A')}</TableRowColumn>
                  <TableRowColumn><Link to={`/underwriting/${application.id}`}><FlatButton label="View Application" primary={true}/></Link></TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>}
      </UnderwritingDashboardWrapper>
    );
  }
}

const mapStateToProps = ({underwriting}) => {
  return {
   underwriting 
  };
};

const mapDispatchToProps = dispatch => ({
  getApplicationsInUnderwriting: () => {
    return dispatch(getApplicationsInUnderwriting());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UnderwritingDashboard);
